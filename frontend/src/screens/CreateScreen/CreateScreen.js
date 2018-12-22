import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import { Form, Field, ImagePickerField } from '../../core/forms'
import { SaveButton } from './components'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 30,
  },
})

class CreateScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Create',
  };

  render() {
    return (
      <Form>
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

export default CreateScreen
