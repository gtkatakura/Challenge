import React, { Component } from 'react'
import { ApolloProvider as ApolloProviderBase } from 'react-apollo'
import { AsyncStorage } from 'react-native'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { ApolloLink, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { createUploadLink } from 'apollo-upload-client'
import { getMainDefinition } from 'apollo-utilities'

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

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
  },
})

const subscriptionMiddleware = {
  async applyMiddleware(options, next) {
    Object.assign(options, {
      token: await AsyncStorage.getItem('@general:token'),
    })

    next()
  },
}

wsLink.subscriptionClient.use([subscriptionMiddleware])

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  uploadLink,
)

const client = new ApolloClient({
  link: ApolloLink.from([
    errorHandlerLink,
    authLink,
    link,
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
