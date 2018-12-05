import GraphQLJSON from 'graphql-type-json'
import { GraphQLDateTime } from 'graphql-iso-date'
import { GraphQLUpload } from 'graphql-upload'

export const typeDefs = `
  scalar JSON
  scalar DateTime
  scalar Upload
`

export const resolvers = {
  JSON: GraphQLJSON,
  DateTime: GraphQLDateTime,
  Upload: GraphQLUpload,
}
