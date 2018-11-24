import Joi from 'joi'
import _ from 'lodash/fp'

const validateCustom = async (record, { schema = {}, context = {} } = {}) => {
  const errors = await Promise.all(
    Object.entries(schema)
      .map(([columnName, validation]) => validation(columnName, record, context)),
  )

  if (errors.some(Boolean)) {
    return _.compact(errors)
  }

  return null
}

export const validateFromJoiSchema = (validationSchema, customValidation) => async (record) => {
  const { error } = Joi.validate(record, validationSchema, {
    abortEarly: false,
    language: {
      key: '',
    },
  })

  const errors = _.compact(_.flatten([
    error && error.details,
    await validateCustom(record, customValidation),
  ]))

  if (errors.length !== 0) {
    return errors
  }

  return null
}
