import { AuthenticationError } from 'apollo-server'
import { ApolloServer } from 'apollo-server-koa'
import { graphqlUploadKoa } from 'graphql-upload'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'
import Koa from 'koa'
import Router from 'koa-router'
import jwt from 'jsonwebtoken'

import config from './config'

import { schema } from './src/schema'
import Storage from './src/core/Storage'

const app = new Koa()
const router = new Router()

app.use(
  graphqlUploadKoa({
    maxFileSize: 10000000, // 10 MB
    maxFiles: 20,
  }),
)

app.use(router.routes())

router.get('/files/:id', (ctx) => {
  ctx.type = 'image/jpg'
  ctx.body = Storage.download(ctx.params.id)
})

const logging = process.env.NODE_ENV === 'development' ? {
  formatError: (error) => {
    console.log(error)
    return error
  },
  formatResponse: (response) => {
    console.log(response)
    return response
  },
} : {}

const createContext = async ({ token }) => {
  if (token) {
    try {
      return {
        me: await jwt.verify(token, config.get('jwt.secret')),
      }
    } catch {
      throw new AuthenticationError('Your session expired. Sign in again.')
    }
  }

  return {}
}

const server = new ApolloServer({
  ...logging,
  schema,
  context: ({ ctx }) => createContext(ctx.request.header),
  uploads: false,
})

server.applyMiddleware({ app })

const koaServer = app.listen(process.env.PORT, () => {
  console.log(
    `Serving http://localhost:${process.env.PORT} for ${process.env.NODE_ENV}.`,
  )
})

SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
    onConnect: createContext,
    onOperation: async (message, params) => ({
      ...params,
      context: {
        ...params.context,
        ...await createContext(message.payload),
      },
    }),
  },
  {
    server: koaServer,
    path: '/graphql',
  },
)
