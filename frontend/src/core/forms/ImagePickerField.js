import React, { Component } from 'react'
import { FormValidationMessage } from 'react-native-elements'

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import ImagePicker from 'react-native-image-picker'
import { ReactNativeFile } from 'apollo-upload-client'

import Form from './Form'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  imageContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
})

class ImagePickerField extends Component {
  static contextType = Form.Context

  state = {
    image: null,
  }

  handleChange = (value) => {
    this.context.update(this.props.name, value)
  }

  selectPhotoTapped = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    }

    ImagePicker.showImagePicker(options, (response) => {
      if (!response.didCancel && !response.error) {
        const image = new ReactNativeFile({
          uri: response.uri,
          type: response.type,
          name: response.fileName,
        })

        this.handleChange(image)
        this.setState({
          image: {
            uri: response.uri,
          },
        })
      }
    })
  }

  render() {
    const { name } = this.props
    const error = this.context.errors[name]

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped}>
          <View
            style={[
              styles.image,
              styles.imageContainer,
              { marginBottom: 20 },
            ]}
          >
            {this.state.image === null ? (
              <Text>Select a Photo</Text>
            ) : (
              <Image style={styles.image} sourcec={this.state.image} />
            )}
          </View>
          {error && (
            <FormValidationMessage>{error.toString()}</FormValidationMessage>
          )}
        </TouchableOpacity>
      </View>
    )
  }
}

export default ImagePickerField
