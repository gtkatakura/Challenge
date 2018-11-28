import React, { Component } from 'react'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import PropTypes from 'prop-types'

import Form from './Form'

class Field extends Component {
  static contextType = Form.Context

  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  handleChange = (value) => {
    this.context.update(this.props.name, value.trim())
  }

  render() {
    const { name, ...props } = this.props
    const error = this.context.errors[name]

    return (
      <>
        <FormLabel>{name}</FormLabel>
        <FormInput onChangeText={this.handleChange} {...props} />
        {error && (
          <FormValidationMessage>{error.toString()}</FormValidationMessage>
        )}
      </>
    )
  }
}
export default Field
