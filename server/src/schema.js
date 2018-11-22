import { makeExecutableSchema } from 'graphql-tools'
import GraphQLJSON from 'graphql-type-json'

import * as ProductType from './modules/product/ProductType'

const SchemaDefinition = `
  scalar JSON

  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    createProduct(input: ProductInput!): ProductEvent
  }

  type Error {
    type: String
    path: [String]
    message: String
    context: JSON
  }
`

const typeDefs = [
  ProductType.typeDefs,
]

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    ...ProductType.queries,
  },
  Mutation: {
    ...ProductType.mutations,
  },
  ...ProductType.resolvers,
}

export const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, ...typeDefs],
  resolvers,
})
