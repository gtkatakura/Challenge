import React from 'react'
import { AsyncStorage } from 'react-native'

const authentication = {
  setToken: token => AsyncStorage.setItem('@general:token', token),
  getToken: () => AsyncStorage.getItem('@general:token'),
  reset: () => AsyncStorage.removeItem('@general:token'),
}

const withAuthentication = WrappedComponent => props => (
  <WrappedComponent
    authentication={authentication}
    {...props}
  />
)

export default withAuthentication
