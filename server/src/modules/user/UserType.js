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

  input UserInput {
    name: String
    email: String
    password: String
  }

  type UserEvent {
    payload: User
    errors: [Error]
  }
`

export const queries = {
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

export const mutations = {
  createUser: async (root, { input }) => {
    const errors = await User.validate(input)

    if (errors) {
      return { errors }
    }

    const user = new User.Model(input)

    await user.save()

    return {
      payload: user,
    }
  },
}
