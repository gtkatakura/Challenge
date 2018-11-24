import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import config from '../../../config'

import * as User from '../user/UserModel'

const createToken = ({ id, email, name }) => jwt.sign({ id, email, name }, config.get('jwt.secret'))

export const typeDefs = `
  input SignUpInput {
    name: String
    email: String
    password: String
  }

  type SignUpEvent {
    payload: Sign
    errors: [Error]
  }

  input SignInInput {
    email: String
    password: String
  }

  type SignInEvent {
    payload: Sign
    errors: [Error]
  }

  type Sign {
    token: String
    user: User
  }
`

export const mutations = `
  signUp(input: SignUpInput!): SignUpEvent
  signIn(input: SignInInput!): SignInEvent
`

const Mutation = {
  signUp: async (root, { input }) => {
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
      payload: {
        user,
      },
    }
  },
  signIn: async (root, { input: { email, password } }) => {
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
        user,
      },
    }
  },
}

export const resolvers = {
  Mutation,
  Sign: {
    token: ({ user }) => createToken(user),
  },
}
