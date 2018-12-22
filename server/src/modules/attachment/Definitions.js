export const typeDefs = `
  type Attachment {
    id: ID
    uri: String
  }
`

const Attachment = {
  uri: attachment => `http://localhost:4000/files/${attachment.id}`,
}

export const resolvers = { Attachment }
