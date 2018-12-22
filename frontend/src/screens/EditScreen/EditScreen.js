import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import { Form, Field, ImagePickerField } from '../../core/forms'
import SaveButton from './components/SaveButton'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 30,
  },
})

class EditScreen extends Component {
  render() {
    const { product } = this.props.navigation.state.params

    return (
      <Form initialValues={product}>
        <View style={styles.container}>
          <ImagePickerField name="photo" />
          <Field name="name" label="NAME" placeholder="Name" />
          <Field keyboardType="numeric" name="price" label="PRICE" placeholder="Price" />
          <SaveButton />
        </View>
      </Form>
    )
  }
}

export default EditScreen
