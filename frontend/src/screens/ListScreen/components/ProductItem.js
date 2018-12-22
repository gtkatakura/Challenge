import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { gql } from 'apollo-boost'

import {
  Avatar, ListItem,
} from 'react-native-elements'
import i18n from 'i18n-js'

const SUBSCRIPTION = gql`
  subscription onProductUpdated($id: ID!) {
    productUpdated(
      where: { id: $id }
    ) {
      id
      name
      price
    }
  }
`

class ProductItem extends Component {
  state = {
    product: this.props.product,
  }

  componentDidMount() {
    this.observer = this.subscribe({
      next: ({ data: { productUpdated } }) => {
        this.setState(({ product }) => ({
          product: {
            ...product,
            ...productUpdated,
          },
        }))
      },
    })
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.unsubscribe()
    }
  }

  subscribe = (...args) => this.props.client.subscribe({
    query: SUBSCRIPTION,
    variables: {
      id: this.props.product.id,
    },
  }).subscribe(...args)

  render() {
    const { navigation } = this.props
    const { product } = this.state

    return (
      <ListItem
        avatar={(
          <Avatar
            source={product.photo}
            large
          />
        )}
        title={product.name}
        subtitle={i18n.l('currency', product.price)}
        onPress={() => navigation.navigate('Edit', { product })}
        onPressRightIcon={() => navigation.navigate('Edit', { product })}
      />
    )
  }
}

export default withApollo(ProductItem)
