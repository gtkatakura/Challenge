
import { AuthenticationError } from 'apollo-server'

import * as Product from './ProductModel'

export const typeDefs = `
  type Product implements Model {
    id: ID
    name: String
    price: Float
    createdAt: DateTime
    updatedAt: DateTime
  }

  type ProductCollection {
    payload: [Product]
    hasMore: Boolean
  }

  input ProductInput {
    name: String
    price: Float
  }

  type ProductEvent {
    payload: Product
    errors: [Error]
  }
`

export const queries = {
  products: async (root, { first, after }, { me }) => {
    if (!me) {
      throw new AuthenticationError('Not authenticated')
    }

    const { items, hasMore } = await Product.Model.paginate({}, {
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
  createProduct: async (root, { input }, { me }) => {
    if (!me) {
      throw new AuthenticationError('Not authenticated')
    }

    const errors = await Product.validate(input)

    if (errors) {
      return { errors }
    }

    const product = new Product.Model(input)

    await product.save()

    return {
      payload: product,
    }
  },
}
