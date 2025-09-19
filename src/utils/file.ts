import fs from 'fs'
import { UPLOAD_IMAGE, UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import formidable, { File } from 'formidable'
import { Request } from 'express'

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
    maxFileSize: 4 * 1024 * 1024, // 4MB
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
    const uploadedFiles: File[] = []

    form.on('file', (_, file) => {
      uploadedFiles.push(file)
    })

    form.parse(req, (err, field, files) => {
      if (err) return reject(err)
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('No file'))
      }
      uploadedFiles.length = 0
      resolve(files.image as File[])
    })

    req.on('close', () => {
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          fs.unlinkSync(file.filepath)
        })
      }
    })
  })
}

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
    const uploadedFiles: File[] = []

    form.on('file', (_, file) => {
      uploadedFiles.push(file)
    })

    form.parse(req, (err, field, files) => {
      if (err) return reject(err)
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('No file'))
      }
      uploadedFiles.length = 0
      return resolve(files.video as File[])
    })

    req.on('close', () => {
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          fs.unlinkSync(file.filepath)
        })
      }
    })
  })
}

export const handleUploadAvatar = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 1,
    maxFileSize: 4 * 1024 * 1024, // 4MB
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
    const uploadedFiles: File[] = []

    form.on('file', (_, file) => {
      uploadedFiles.push(file)
    })

    form.parse(req, (err, field, files) => {
      if (err) return reject(err)
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('No file'))
      }
      uploadedFiles.length = 0
      resolve(files.image as File[])
    })

    req.on('close', () => {
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          fs.unlinkSync(file.filepath)
        })
      }
    })
  })
}

export const handleCoverPhoto = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 1,
    maxFileSize: 4 * 1024 * 1024, // 4MB
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
    const uploadedFiles: File[] = []

    form.on('file', (_, file) => {
      uploadedFiles.push(file)
    })

    form.parse(req, (err, field, files) => {
      if (err) return reject(err)
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('No file'))
      }
      uploadedFiles.length = 0
      resolve(files.image as File[])
    })

    req.on('close', () => {
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          fs.unlinkSync(file.filepath)
        })
      }
    })
  })
}
