import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

import {
  SignButton,
  SignForm,
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
      <SignForm>
        <EmailField />
        <PasswordField />
        <SignInButton />
      </SignForm>
    )
  }
}

export default SignInScreen
