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

export const queries = `
  products(first: Int = 20, after: ID): ProductCollection
`

export const mutations = `
  createProduct(input: ProductInput!): ProductEvent
`

const Query = {
  products: async (root, { first, after }) => {
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

const Mutation = {
  createProduct: async (root, { input }) => {
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

export const resolvers = { Query, Mutation }
