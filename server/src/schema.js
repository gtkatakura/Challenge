import { makeExecutableSchema } from 'graphql-tools'
import GraphQLJSON from 'graphql-type-json'
import { GraphQLDateTime } from 'graphql-iso-date'
import { AuthenticationError } from 'apollo-server'
import _ from 'lodash/fp'

import { applyInterceptor } from './modules/core'

import * as ProductType from './modules/product/ProductType'
import * as UserType from './modules/user/UserType'
import * as AuthenticationType from './modules/authentication/Type'

const mergeAllBy = (iteratee, objects) => _.mergeAll(_.map(iteratee, objects))

const types = [
  AuthenticationType,
  ProductType,
  UserType,
]

const typeDefs = types.map(type => type.typeDefs)

const isAuthenticated = (root, args, { me }) => {
  if (!me) {
    throw new AuthenticationError('Not authenticated')
  }
}

const resolvers = _.merge({
  JSON: GraphQLJSON,
  DateTime: GraphQLDateTime,
  ...applyInterceptor(isAuthenticated, mergeAllBy('resolvers', types)),
}, AuthenticationType.resolvers)

const SchemaDefinition = `
  scalar JSON
  scalar DateTime

  interface Model {
    id: ID
    createdAt: DateTime
    updatedAt: DateTime
  }

  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    ${_.map('queries', types).join('')}
  }

  type Mutation {
    ${_.map('mutations', types).join('')}
  }

  type Error {
    type: String
    path: [String]
    message: String
    context: JSON
  }
`

export const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, ...typeDefs],
  resolvers,
})
