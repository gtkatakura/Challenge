import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import { StyleSheet } from 'react-native'
import { Button, Text } from 'react-native-elements'

import { Field } from '../../core/forms'

import {
  SignButton,
  SignForm,
  EmailField,
  PasswordField,
} from './components'

const styles = StyleSheet.create({
  dividerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
})

const NameField = () => (
  <Field name="name" label="USERNAME" placeholder="Username" />
)

const signUpMutation = gql`
  mutation SignUpMutation($input: SignUpInput!) {
    sign: signUp(input: $input) {
      payload {
        token
      }
      errors {
        type
        path
        message
        context
      }
    }
  }
`

const SignUpButton = props => (
  <Mutation mutation={signUpMutation}>
    {signUp => (
      <SignButton
        title="SIGN UP"
        mutation={signUp}
        {...props}
      />
    )}
  </Mutation>
)

class SignUpScreen extends Component {
  static navigationOptions = {
    title: 'Sign up',
  }

  render() {
    return (
      <SignForm>
        <NameField />
        <EmailField />
        <PasswordField />
        <SignUpButton />
        <Text style={styles.dividerText}>OR</Text>
        <Button title="SIGN IN" onPress={() => this.props.navigation.navigate('SignIn')} />
      </SignForm>
    )
  }
}

export default SignUpScreen
