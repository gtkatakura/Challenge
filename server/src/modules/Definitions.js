import { AuthenticationError } from 'apollo-server'
import _ from 'lodash/fp'

import { applyInterceptor } from '../core'

import * as AttachmentDefinitions from './attachment/Definitions'
import * as ProductDefinitions from './product/Definitions'
import * as UserDefinitions from './user/Definitions'
import * as AuthenticationDefinitions from './authentication/Definitions'

const mergeAllBy = (iteratee, objects) => _.mergeAll(_.map(iteratee, objects))

const definitions = [
  AttachmentDefinitions,
  AuthenticationDefinitions,
  ProductDefinitions,
  UserDefinitions,
]

const schemaDefinition = `
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

  type Query {
    ${_.map('queries', definitions).join('')}
  }

  type Mutation {
    ${_.map('mutations', definitions).join('')}
  }

  type Subscription {
    ${_.map('subscriptions', definitions).join('')}
  }
`

export const typeDefs = [
  schemaDefinition,
  ..._.map('typeDefs', definitions),
]

const isAuthenticated = (root, args, { me }) => {
  if (!me) {
    throw new AuthenticationError('Not authenticated')
  }
}

export const resolvers = _.merge(
  applyInterceptor(isAuthenticated, mergeAllBy('resolvers', definitions)),
  AuthenticationDefinitions.resolvers,
)
