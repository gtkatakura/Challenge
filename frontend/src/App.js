import React, { Component } from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { createStackNavigator, createAppContainer } from 'react-navigation'

import AppScreen from './screens/AppScreen'
import HomeScreen from './screens/HomeScreen'
import SignInScreen from './screens/AuthScreen/SignInScreen'
import SignUpScreen from './screens/AuthScreen/SignUpScreen'

const HomeStack = createStackNavigator({ Home: HomeScreen })

const AuthStack = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
}, {
  initialRouteName: 'SignUp',
})

const StackNavigator = createStackNavigator({
  App: AppScreen,
  Home: HomeStack,
  Auth: AuthStack,
}, {
  initialRouteName: 'App',
  headerMode: 'none',
})

const AppContainer = createAppContainer(StackNavigator)

const client = new ApolloClient({
  uri: 'http://localhost:4000',
})

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <AppContainer />
      </ApolloProvider>
    )
  }
}
