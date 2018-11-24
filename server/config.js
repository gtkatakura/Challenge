import convict from 'convict'
import dotenv from 'dotenv'

dotenv.config()

const config = convict({
  mongodb: {
    uri: {
      doc: 'The URI from MongoDB',
      default: 'mongodb://localhost/FotonTech-Challenge',
      env: 'MONGODB_URI',
    },
  },
  jwt: {
    secret: {
      doc: 'The secret key for the JWT',
      default: 'FotonTech-Challenge',
      env: 'JWT_SECRET_KEY',
    },
  },
  auth: {
    bcrypt: {
      salt: {
        doc: 'The salt to be used in encryption',
        default: 10,
        env: 'AUTH_BCRYPT_SALT',
      },
    },
  },
})

config.validate()

export default config
