import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { AsyncStorage } from 'react-native'

const authentication = {
  setToken: token => AsyncStorage.setItem('@general:token', token),
  getToken: () => AsyncStorage.getItem('@general:token'),
  reset: () => AsyncStorage.removeItem('@general:token'),
}

const withAuthentication = WrappedComponent => hoistNonReactStatics(props => (
  <WrappedComponent
    authentication={authentication}
    {...props}
  />
), WrappedComponent)

export default withAuthentication
