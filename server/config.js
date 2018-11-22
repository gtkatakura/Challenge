const convict = require('convict')

require('dotenv').config()

const config = convict({
  mongodb: {
    uri: {
      doc: 'The URI from MongoDB',
      default: 'mongodb://localhost/FotonTech-Challenge',
      env: 'MONGODB_URI',
    },
  },
})

config.validate()

export default config
