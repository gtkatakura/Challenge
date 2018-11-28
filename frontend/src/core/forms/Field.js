import React, { Component } from 'react'
import { TextInput, Text } from 'react-native'
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
        <TextInput onChangeText={this.handleChange} {...props} />
        {error && (
          <Text style={{ color: 'red' }}>{error.toString()}</Text>
        )}
      </>
    )
  }
}
export default Field
