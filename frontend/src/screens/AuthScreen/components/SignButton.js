import React, { Component } from 'react'
import { Button } from 'react-native-elements'
import { withNavigation } from 'react-navigation'

import { Form, toFormErrors } from '../../../core/forms'
import { withAuthentication } from '../../../services'

class SignButton extends Component {
  static contextType = Form.Context

  handlePress = async () => {
    const {
      mutation,
      navigation,
      authentication,
    } = this.props

    const {
      data: {
        sign: {
          payload,
          errors,
        },
      },
    } = await mutation({
      variables: {
        input: this.context.values,
      },
    })

    this.context.setErrors(toFormErrors(errors || []))

    if (!errors) {
      await authentication.setToken(payload.token)

      navigation.navigate('Home')
    }
  }

  render() {
    return (
      <Button
        title={this.props.title}
        onPress={this.handlePress}
      />
    )
  }
}

export default withNavigation(withAuthentication(SignButton))
