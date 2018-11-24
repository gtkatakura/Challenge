import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server'

import config from '../../../config'

import * as User from './UserModel'

const createToken = ({ id, email, name }) => jwt.sign({ id, email, name }, config.get('jwt.secret'))

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

  type SignInEvent {
    payload: SignInPayload
    errors: [Error]
  }

  type SignInPayload {
    token: String
  }
`

export const queries = {
  users: async (root, { first, after }, { me }) => {
    if (!me) {
      throw new AuthenticationError('Not authenticated')
    }

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

    const passwordHash = await bcrypt.hash(input.password, config.get('auth.bcrypt.salt'))

    const user = new User.Model({
      ...input,
      password: passwordHash,
    })

    await user.save()

    return {
      payload: user,
    }
  },
  signIn: async (root, { email, password }) => {
    const user = await User.Model.findOne({ email })

    if (!user) {
      return {
        errors: [{
          type: 'signIn.email.invalid',
          path: ['email'],
          message: 'invalid',
        }],
      }
    }

    if (!await bcrypt.compare(password, user.password)) {
      return {
        errors: [{
          type: 'signIn.password.invalid',
          path: ['password'],
          message: 'invalid',
        }],
      }
    }

    return {
      payload: {
        token: createToken(user),
      },
    }
  },
}

export const resolvers = {
  User: {
    email: (user, args, { me }) => {
      if (user.id === me.id) {
        return user.email
      }

      return null
    },
  },
}
