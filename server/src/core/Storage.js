import mongodb from 'mongodb'
import database from '../database'

const upload = ({ filename, stream }) => {
  const bucket = new mongodb.GridFSBucket(database.db)

  const uploadStream = bucket.openUploadStream(filename)

  return new Promise((resolve, reject) => {
    stream
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', resolve)
  })
}

const download = (id) => {
  const bucket = new mongodb.GridFSBucket(database.db)

  return bucket.openDownloadStream(new mongodb.ObjectID(id))
}

export default { upload, download }
