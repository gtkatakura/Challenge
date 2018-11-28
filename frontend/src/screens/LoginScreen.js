import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-elements'

import { Form, Field } from '../core/forms'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    padding: 30,
  },
})

const SignInMutation = gql`
  mutation SignInMutation($input: SignInInput!) {
    signIn(input: $input) {
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

const merge = (left, right) => Object.assign(left, right)

const toFormError = ({ path, message }) => ({ [path]: [message] })

const toFormErrors = errors => errors.map(toFormError).reduce(merge, {})

class LoginScreen extends Component {
  render() {
    return (
      <Form>
        <Mutation mutation={SignInMutation}>
          {signIn => (
            <View style={styles.container}>
              <Field name="EMAIL" placeholder="Please enter your email..." />
              <Field name="PASSWORD" placeholder="Please enter your pasword..." secureTextEntry />

              <Form.Consumer>
                {({ values, setErrors }) => (
                  <Button
                    title="LOGIN"
                    onPress={async () => {
                      const {
                        data: {
                          signIn: {
                            errors,
                          },
                        },
                      } = await signIn({
                        variables: {
                          input: values,
                        },
                      })

                      setErrors(toFormErrors(errors || []))
                    }}
                  />
                )}
              </Form.Consumer>
            </View>
          )}
        </Mutation>
      </Form>
    )
  }
}

export default LoginScreen
