import React, { Component } from 'react'
import { ApolloProvider as ApolloProviderBase } from 'react-apollo'
import { AsyncStorage } from 'react-native'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'

const errorHandlerLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => console.log(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
    ))
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
})

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('@general:token')

  return {
    headers: {
      ...headers,
      token,
    },
  }
})

const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
})

const client = new ApolloClient({
  link: ApolloLink.from([
    errorHandlerLink,
    authLink,
    uploadLink,
  ]),
  cache: new InMemoryCache(),
  credentials: 'same-origin',
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
