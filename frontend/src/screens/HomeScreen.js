import React, { Component } from 'react'
import { Button } from 'react-native-elements'

import { withAuthentication } from '../services'

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
  }

  logout = async () => {
    await this.props.authentication.reset()
    this.props.navigation.navigate('Auth')
  }

  render() {
    return (
      <Button
        title="Logout"
        onPress={this.logout}
      />
    )
  }
}

export default withAuthentication(HomeScreen)
