import { PubSub, withFilter } from 'apollo-server'
import _ from 'lodash/fp'

import * as Product from './ProductModel'
import Storage from '../../core/Storage'

const pubsub = new PubSub()

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

  input ProductUpdateInput {
    id: ID
    name: String
    price: Float
    photo: Upload
  }

  input ProductFilterObject {
    id: ID
    name: String
    price: Float
  }
`

export const queries = `
  products(search: String, first: Int = 20, after: ID): ProductCollection
`

export const mutations = `
  createProduct(input: ProductInput!): ProductEvent
  updateProduct(input: ProductUpdateInput!): ProductEvent
`

export const subscriptions = `
  productUpdated(where: ProductFilterObject): Product
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
    const errors = await Product.validate({ id: null, ...input })

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
  updateProduct: async (root, { input }) => {
    const errors = await Product.validate(input)

    if (errors) {
      return { errors }
    }

    // const { stream, filename } = await input.photo

    // const file = await Storage.upload({ filename, stream })

    const product = await Product.Model.findById(input.id)

    product.set(input)

    await product.save()

    pubsub.publish('PRODUCT_UPDATED', { productUpdated: product })

    return {
      payload: product,
    }
  },
}

const Subscription = {
  productUpdated: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(['PRODUCT_UPDATED']),
      ({ productUpdated: product }, { where }) => _.isEqual(
        _.pick(_.keys(where), product),
        where,
      ),
    ),
  },
}

export const resolvers = {
  Query,
  Mutation,
  Subscription,
  Product: {
    photo: product => ({ id: product.photoId.toString() }),
  },
}
