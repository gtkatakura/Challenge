import { ApolloServer, AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'

import config from './config'

import { schema } from './src/schema'

const server = new ApolloServer({
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
