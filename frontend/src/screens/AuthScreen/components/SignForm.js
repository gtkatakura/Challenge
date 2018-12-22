import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Form as FormBase } from '../../../core/forms'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 30,
  },
})

const Form = ({ style, children }) => (
  <FormBase style={[styles.container, style]}>
    <View style={styles.container}>
      {children}
    </View>
  </FormBase>
)

export default Form
