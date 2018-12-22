import { graphql } from 'graphql'

const { MongoClient } = require('mongodb')

const User = require('../../user/UserModel')
const Product = require('../ProductModel')
const { schema } = require('../../../schema')

describe('Query.products', () => {
  let connection
  let context

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__)
    const me = new User.Model({
      name: 'johndoe',
      email: 'john@doe.com',
      password: 'johndoe',
    })

    await me.save()

    context = { me }
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should return a empty collection', async () => {
    const query = `
      query {
        products {
          payload {
            id
          }
          hasMore
        }
      }
    `

    const rootValue = {}
    const variables = {}

    const result = await graphql(schema, query, rootValue, context, variables)

    expect(result).toEqual({
      data: {
        products: {
          payload: [],
          hasMore: false,
        },
      },
    })
  })

  it('should return a collection and hasMore false', async () => {
    await new Product.Model({
      name: 'First Product',
      price: 12.34,
    }).save()

    const query = `
      query {
        products {
          payload {
            name
            price
          }
          hasMore
        }
      }
    `

    const rootValue = {}
    const variables = {}

    const result = await graphql(schema, query, rootValue, context, variables)

    expect(result).toEqual({
      data: {
        products: {
          payload: [
            {
              name: 'First Product',
              price: 12.34,
            },
          ],
          hasMore: false,
        },
      },
    })
  })

  it('should return a collection and hasMore true', async () => {
    await new Product.Model({
      name: 'First Product',
      price: 12.34,
    }).save()

    await new Product.Model({
      name: 'Second Product',
      price: 567.89,
    }).save()

    const query = `
      query {
        products(first: 1) {
          payload {
            name
            price
          }
          hasMore
        }
      }
    `

    const rootValue = {}
    const variables = {}

    const result = await graphql(schema, query, rootValue, context, variables)

    expect(result).toEqual({
      data: {
        products: {
          payload: [
            {
              name: 'First Product',
              price: 12.34,
            },
          ],
          hasMore: true,
        },
      },
    })
  })

  it('should return a collection after id', async () => {
    const firstProduct = new Product.Model({
      name: 'First Product',
      price: 12.34,
    })

    await firstProduct.save()

    await new Product.Model({
      name: 'Second Product',
      price: 567.89,
    }).save()

    const query = `
      query {
        products(after: "${firstProduct.id}") {
          payload {
            name
            price
          }
          hasMore
        }
      }
    `

    const rootValue = {}
    const variables = {}

    const result = await graphql(schema, query, rootValue, context, variables)

    expect(result).toEqual({
      data: {
        products: {
          payload: [
            {
              name: 'Second Product',
              price: 567.89,
            },
          ],
          hasMore: false,
        },
      },
    })
  })
})
