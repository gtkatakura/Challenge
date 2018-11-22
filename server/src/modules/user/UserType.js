import * as User from './UserModel'

export const typeDefs = `
  type User {
    id: ID
    name: String
    email: String
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
  createUser: (root, { input }) => {
    const errors = User.validate(input)

    if (errors) {
      return { errors }
    }

    const user = new User.Model(input)

    user.save()

    return {
      payload: user,
    }
  },
}

export const resolvers = {
  User: {
    id: user => user.get('_id').toString(),
  },
}
