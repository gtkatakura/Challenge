import React from 'react'
import { Field } from '../../../core/forms'

export const EmailField = () => (
  <Field name="email" label="EMAIL" placeholder="Email" />
)

export const PasswordField = () => (
  <Field name="password" label="PASSWORD" placeholder="Password" secureTextEntry />
)

export { default as SignForm } from './SignForm'
export { default as SignButton } from './SignButton'
