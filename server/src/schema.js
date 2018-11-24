import { makeExecutableSchema } from 'graphql-tools'
import GraphQLJSON from 'graphql-type-json'
import { GraphQLDateTime } from 'graphql-iso-date'
import _ from 'lodash/fp'

import * as ProductType from './modules/product/ProductType'
import * as UserType from './modules/user/UserType'

const mergeAllBy = (iteratee, objects) => _.mergeAll(_.map(iteratee, objects))

const types = [
  ProductType,
  UserType,
]

const typeDefs = types.map(type => type.typeDefs)

const resolvers = {
  JSON: GraphQLJSON,
  DateTime: GraphQLDateTime,
  ...mergeAllBy('resolvers', types),
}

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

console.log(SchemaDefinition)

export const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, ...typeDefs],
  resolvers,
})
