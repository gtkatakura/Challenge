import * as Product from './ProductModel'
import Storage from '../../core/Storage'

export const typeDefs = `
  type Product implements Model {
    id: ID
    name: String
    price: Float
    photo: Attachment
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
    photo: Upload
  }

  type ProductEvent {
    payload: Product
    errors: [Error]
  }
`

export const queries = `
  products(search: String, first: Int = 20, after: ID): ProductCollection
`

export const mutations = `
  createProduct(input: ProductInput!): ProductEvent
`

const Query = {
  products: async (root, { search, first, after }) => {
    const query = !search ? {} : {
      name: {
        $regex: new RegExp(search),
        $options: 'i',
      },
    }

    const { items, hasMore } = await Product.Model.paginate(query, {
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

    const { stream, filename } = await input.photo

    const file = await Storage.upload({ filename, stream })

    const product = new Product.Model({
      photoId: file._id, // eslint-disable-line no-underscore-dangle
      ...input,
    })

    await product.save()

    return {
      payload: product,
    }
  },
}

export const resolvers = {
  Query,
  Mutation,
  Product: {
    photo: product => ({ id: product.photoId.toString() }),
  },
}
