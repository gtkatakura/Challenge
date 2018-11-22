import ProductModel from './ProductModel'

export const typeDefs = `
  type Product {
    name: String
    price: Float
  }
`

export const resolvers = {
  products: () => ProductModel.find(),
}
