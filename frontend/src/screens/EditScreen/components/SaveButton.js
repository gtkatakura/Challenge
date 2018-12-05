import React, { Component } from 'react'
import { withNavigation } from 'react-navigation'
import { Button } from 'react-native-elements'
import { withApollo } from 'react-apollo'
import { gql } from 'apollo-boost'

import { Form, toFormErrors } from '../../../core/forms'

const updateProductMutation = gql`
  mutation UpdateProductMutation($input: ProductUpdateInput!) {
    updateProduct(input: $input) {
      payload {
        id
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

class SaveButton extends Component {
  static contextType = Form.Context

  handlePress = async () => {
    try {
      const {
        data: {
          updateProduct: {
            errors,
          },
        },
      } = await this.props.client.mutate({
        mutation: updateProductMutation,
        variables: {
          input: {
            ...this.context.values,
            price: +this.context.values.price,
            __typename: undefined,
          },
        },
      })

      this.context.setErrors(toFormErrors(errors || []))

      if (!errors) {
        this.props.navigation.navigate('List')
      }
    } catch (err) {
      console.warn('err', err)
    }
  }

  render() {
    return (
      <Button
        title="SAVE"
        onPress={this.handlePress}
      />
    )
  }
}

export default withNavigation(withApollo(SaveButton))
