import React, { Component } from 'react'
import { createStackNavigator, createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'

import ApolloProvider from './components/ApolloProvider'

import AppScreen from './screens/AppScreen'
import SignInScreen from './screens/AuthScreen/SignInScreen'
import SignUpScreen from './screens/AuthScreen/SignUpScreen'
import ListScreen from './screens/ListScreen'
import CreateScreen from './screens/CreateScreen'
import EditScreen from './screens/EditScreen'

const AuthStack = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
}, {
  initialRouteName: 'SignUp',
})

const HomeStack = createMaterialTopTabNavigator({
  List: ListScreen,
  Create: CreateScreen,
}, {
  initialRouteName: 'List',
})

const StackNavigator = createStackNavigator({
  App: AppScreen,
  Home: HomeStack,
  Auth: AuthStack,
  Edit: EditScreen,
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
