import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

import {
  SignButton,
  Form,
  EmailField,
  PasswordField,
} from './components'

const signInMutation = gql`
  mutation SignInMutation($input: SignInInput!) {
    sign: signIn(input: $input) {
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
const SignInButton = props => (
  <Mutation mutation={signInMutation}>
    {signIn => (
      <SignButton
        title="LOGIN"
        mutation={signIn}
        {...props}
      />
    )}
  </Mutation>
)

class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Sign in',
  }

  render() {
    return (
      <Form>
        <EmailField />
        <PasswordField />
        <SignInButton />
      </Form>
    )
  }
}

export default SignInScreen
