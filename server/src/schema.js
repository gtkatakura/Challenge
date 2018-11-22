import { makeExecutableSchema } from 'graphql-tools'
import GraphQLJSON from 'graphql-type-json'
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
  Query: mergeAllBy('queries', types),
  Mutation: mergeAllBy('mutations', types),
  ...mergeAllBy('resolvers', types),
}

const SchemaDefinition = `
  scalar JSON

  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    products: [Product]
    users: [User]
  }

  type Mutation {
    createProduct(input: ProductInput!): ProductEvent
    createUser(input: UserInput!): UserEvent
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
