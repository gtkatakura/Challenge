import React, { Component } from 'react'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import PropTypes from 'prop-types'

import Form from './Form'

class Field extends Component {
  static contextType = Form.Context

  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  getValue = () => this.context.values[this.props.name]

  update = value => this.context.update(this.props.name, value)

  handleChange = value => this.update(value)

  handleBlur = () => this.update(this.getValue() && this.getValue().toString().trim())

  render() {
    const { name, label, ...props } = this.props
    const value = this.getValue()
    const error = this.context.errors[name]

    return (
      <>
        <FormLabel>{label}</FormLabel>
        <FormInput
          onChangeText={this.handleChange}
          onBlur={this.handleBlur}
          value={value && value.toString()}
          {...props}
        />
        {error && (
          <FormValidationMessage>{error.toString()}</FormValidationMessage>
        )}
      </>
    )
  }
}
export default Field
