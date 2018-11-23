import { Schema } from 'mongoose'
import paginationPlugin from 'mongoose-cursor-pagination'
import Joi from 'joi'
import database from '../../database'
import { validateFromJoiSchema, validations } from '../../core'

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  },
)

UserSchema.plugin(paginationPlugin)

export const Model = database.model('User', UserSchema)

const validationSchema = Joi.object().keys({
  name: Joi.string().required().min(3),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
})

const customSchema = {
  name: validations.unique,
  email: validations.unique,
}

export const validate = validateFromJoiSchema(validationSchema, {
  schema: customSchema,
  context: { Model },
})

