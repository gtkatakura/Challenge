import React, { Component } from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider as ApolloProviderBase } from 'react-apollo'
import { AsyncStorage } from 'react-native'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  request: async (operation) => {
    const token = await AsyncStorage.getItem('@general:token')

    operation.setContext({
      headers: {
        token,
      },
    })
  },
})

export default class ApolloProvider extends Component {
  render() {
    return (
      <ApolloProviderBase client={client}>
        {this.props.children}
      </ApolloProviderBase>
    )
  }
}
