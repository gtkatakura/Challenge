import Joi from 'joi'

export const validateFromJoiSchema = validationSchema => (product) => {
  const { error } = Joi.validate(product, validationSchema, {
    abortEarly: false,
    language: {
      key: '',
    },
  })

  if (error) {
    return error.details
  }

  return null
}
