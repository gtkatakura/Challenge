import * as Product from './ProductModel'

export const typeDefs = `
  type Product {
    id: ID
    name: String
    price: Float
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
  createProduct: (root, { input }) => {
    const errors = Product.validate(input)

    if (errors) {
      return { errors }
    }

    const product = new Product.Model(input)

    product.save()

    return {
      payload: product,
    }
  },
}

export const resolvers = {
  Product: {
    id: product => product.get('_id').toString(),
  },
}
