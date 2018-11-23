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
  Query: mergeAllBy('queries', types),
  Mutation: mergeAllBy('mutations', types),
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
    products(first: Int = 20, after: ID): ProductCollection
    users(first: Int = 20, after: ID): UserCollection
  }

  type Mutation {
    createProduct(input: ProductInput!): ProductEvent
    createUser(input: UserInput!): UserEvent
    signIn(email: String, password: String): SignInEvent
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
