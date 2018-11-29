import React, { Component } from 'react'
import {
  ActivityIndicator, StyleSheet, View,
} from 'react-native'

import { withAuthentication } from '../services'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
})

class AppScreen extends Component {
  async componentDidMount() {
    const token = await this.props.authentication.getToken()

    if (token) {
      this.props.navigation.navigate('Home')
    } else {
      this.props.navigation.navigate('Auth')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}

export default withAuthentication(AppScreen)
