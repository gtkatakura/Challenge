import { ApolloServer, AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'

import config from './config'

import { schema } from './src/schema'

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

const server = new ApolloServer({
  ...logging,
  schema,
  context: async ({ req }) => {
    const { token } = req.headers

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
  },
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
