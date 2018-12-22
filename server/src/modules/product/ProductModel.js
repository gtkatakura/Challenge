import { Schema } from 'mongoose'
import paginationPlugin from 'mongoose-cursor-pagination'
import Joi from 'joi'
import database from '../../database'
import { validateFromJoiSchema, validations } from '../../core'

const ProductSchema = new Schema(
  {
    name: String,
    price: Number,
    photoId: Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  },
)

ProductSchema.plugin(paginationPlugin)

export const Model = database.model('Product', ProductSchema)

const requiredWhenCreate = field => field.when('id', {
  is: null,
  then: Joi.any().required(),
  otherwise: Joi.any().optional(),
})

const validationSchema = Joi.object().keys({
  id: Joi.alternatives([Joi.string(), Joi.any().valid([null])]),
  name: requiredWhenCreate(Joi.string().min(3)),
  price: requiredWhenCreate(Joi.number().positive()),
  photo: requiredWhenCreate(Joi.any()),
})

const customSchema = {
  name: validations.unique,
}

export const validate = validateFromJoiSchema(validationSchema, {
  schema: customSchema,
  context: { Model },
})
