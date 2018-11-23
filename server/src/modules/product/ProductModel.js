import { Schema } from 'mongoose'
import Joi from 'joi'
import database from '../../database'
import { validateFromJoiSchema, validations } from '../../core'

const ProductSchema = new Schema(
  {
    name: String,
    price: Number,
  },
  {
    timestamps: true,
  },
)

export const Model = database.model('Product', ProductSchema)

const validationSchema = Joi.object().keys({
  name: Joi.string().required().min(3),
  price: Joi.number().required().integer().positive(),
})

const customSchema = {
  name: validations.unique,
}

export const validate = validateFromJoiSchema(validationSchema, {
  schema: customSchema,
  context: { Model },
})

