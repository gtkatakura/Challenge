import mongoose from 'mongoose'
import config from '../config'

const uri = config.get('mongodb.uri')

const database = mongoose.createConnection(uri)

database.on('connected', () => {
  console.log(`Mongoose default connection open to ${uri}`)
})

database.on('error', (error) => {
  console.log(`Mongoose default connection error: ${error}`)
})

database.on('disconnected', () => {
  console.log('Mongoose default connection disconnected')
})

export default database
