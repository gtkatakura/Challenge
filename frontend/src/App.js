import React, { Component } from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'

import ApolloProvider from './components/ApolloProvider'

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

export default class App extends Component {
  render() {
    return (
      <ApolloProvider>
        <AppContainer />
      </ApolloProvider>
    )
  }
}
