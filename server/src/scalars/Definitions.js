import GraphQLJSON from 'graphql-type-json'
import { GraphQLDateTime } from 'graphql-iso-date'

export const typeDefs = `
  scalar JSON
  scalar DateTime
`

export const resolvers = {
  JSON: GraphQLJSON,
  DateTime: GraphQLDateTime,
}
