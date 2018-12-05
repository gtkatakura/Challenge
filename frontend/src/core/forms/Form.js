import React, { Component, createContext } from 'react'
import PropTypes from 'prop-types'

const Context = createContext({})

const { Provider, Consumer } = Context

class Form extends Component {
  static Context = Context

  static Consumer = Consumer

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  static propTypes = {
    initialValues: PropTypes.shape({}),
  }

  static defaultProps = {
    initialValues: {},
  }

  update = (name, value) => this.setState(({ values }) => ({
    values: {
      ...values,
      [name]: value,
    },
  }))

  setErrors = errors => this.setState({ errors })

  state = {
    values: this.props.initialValues,
    errors: {},
    update: this.update,
    setErrors: this.setErrors,
  }

  render() {
    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    )
  }
}

export default Form
