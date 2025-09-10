import fs from 'fs'
import { UPLOAD_IMAGE, UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import formidable, { File } from 'formidable'
import { Request } from 'express'

// handler khi chưa có folder uploads thì sẽ tự tạo
export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      return fs.mkdirSync(dir, {
        recursive: true
      })
    }
  })
}

/* 
  hander file image
    - files là 1 object, có key là image và value là 1 mảng chứa các object là file
      {
        image: [
          {
            filepath: 'D:\\WorkSpace\\FullStack\\Project\\mira-social\\mira-social-be\\uploads\\temp\\upload_9f3c8f3e1f4e4b6a9f0c3b8e8e8e8e8e.png',
            originalFilename: 'image.png',
            mimetype: 'image/png',
            size: 12345,
            ...
          }
          ...........
        ]
      }
*/
export const handleUploadImage = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 1,
    maxFileSize: 1 * 1024 * 1024, // 1MB
    keepExtensions: true,
    filter: ({ name, originalFilename, mimetype }) => {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file name') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, field, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('No file'))
      }
      resolve(files.image as File[])
    })
  })
}

/*
  handler file video
*/
export const handleUploadVideo = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_VIDEO,
    maxFiles: 1,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    keepExtensions: true,
    filter: ({ name, originalFilename, mimetype }) => {
      const valid = name === 'video' && Boolean(mimetype?.includes('video/'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file name') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, field, files) => {
      if (err) {
        reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('No file'))
      }
      return resolve(files.video as File[])
    })
  })
}

/*
  handler file avatar
*/
export const handleUploadAvatar = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 1,
    maxFileSize: 1 * 1024 * 1024, // 1MB
    keepExtensions: true,
    filter: ({ name, originalFilename, mimetype }) => {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file image') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, field, files) => {
      if (err) {
        reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('No file'))
      }
      return resolve(files.image as File[])
    })
  })
}

/*
  handler file cover photo
*/
export const handleCoverPhoto = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 1,
    maxFileSize: 1 * 1024 * 1024, // 1MB
    keepExtensions: true,
    filter: ({ name, originalFilename, mimetype }) => {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file image') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, field, files) => {
      if (err) {
        reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('No file'))
      }
      return resolve(files.image as File[])
    })
  })
}
