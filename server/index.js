import { ApolloServer } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools'
import GraphQLJSON from 'graphql-type-json'

import * as BookType from './src/modules/book/BookType'
import * as AuthorType from './src/modules/author/AuthorType'
import * as ProductType from './src/modules/product/ProductType'

const SchemaDefinition = `
  scalar JSON

  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    books: [Book]
    authors: [Author]
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

const typeDefs = [BookType.typeDefs, AuthorType.typeDefs, ProductType.typeDefs]

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    ...BookType.resolvers,
    ...AuthorType.resolvers,
    ...ProductType.queries,
  },
  Mutation: {
    ...ProductType.mutations,
  },
  ...ProductType.resolvers,
}

const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, ...typeDefs],
  resolvers,
})

const server = new ApolloServer({ schema })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
