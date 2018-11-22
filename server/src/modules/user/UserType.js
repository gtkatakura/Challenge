import * as User from './UserModel'

export const typeDefs = `
  type User implements Model {
    id: ID
    name: String
    email: String
    createdAt: DateTime
    updatedAt: DateTime
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
  users: () => User.Model.find(),
}

export const mutations = {
  createUser: async (root, { input }) => {
    const errors = User.validate(input)

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
