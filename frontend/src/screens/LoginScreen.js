import React, { Component } from 'react'
import {
  StyleSheet, View, Button,
  TextInput,
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    padding: 30,
  },
})

class LoginScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="email"
        />
        <TextInput
          placeholder="password"
          secureTextEntry
        />
        <Button
          title="LOGIN"
          color="green"
          onPress={() => {}}
        />
      </View>
    )
  }
}

export default LoginScreen
