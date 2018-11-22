import { Schema } from 'mongoose'
import database from '../../database'

const ProductSchema = new Schema(
  {
    name: String,
    price: Number,
  },
  {
    timestamps: true,
  },
)

const ProductModel = database.model('Product', ProductSchema)

export default ProductModel
