import * as Product from './ProductModel'

export const typeDefs = `
  type Product implements Model {
    id: ID
    name: String
    price: Float
    createdAt: DateTime
    updatedAt: DateTime
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
  products: () => Product.Model.find(),
}

export const mutations = {
  createProduct: async (root, { input }) => {
    const errors = Product.validate(input)

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
