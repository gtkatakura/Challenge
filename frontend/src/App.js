import React, { Component } from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

import LoginScreen from './screens/LoginScreen'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
})

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <LoginScreen />
      </ApolloProvider>
    )
  }
}
