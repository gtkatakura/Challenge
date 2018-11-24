import * as User from './UserModel'

export const typeDefs = `
  type User implements Model {
    id: ID
    name: String
    email: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type UserCollection {
    payload: [User]
    hasMore: Boolean
  }
`

export const queries = `
  users(first: Int = 20, after: ID): UserCollection
`

const Query = {
  users: async (root, { first, after }) => {
    const { items, hasMore } = await User.Model.paginate({}, {
      sort: { _id: 1 },
      limit: first,
      startingAfter: after,
    })

    return {
      payload: items,
      hasMore,
    }
  },
}

export const resolvers = {
  Query,
  User: {
    email: (user, args, { me }) => {
      if (user.id === me.id) {
        return user.email
      }

      return null
    },
  },
}
