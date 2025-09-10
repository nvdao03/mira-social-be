import { Request } from 'express'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE } from '~/constants/dir'
import { MediaTypes } from '~/constants/enums'
import { handleUploadAvatar, handleUploadImage, handleUploadVideo } from '~/utils/file'
import { handleGetNameFile } from '~/utils/other'

class MediaService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const newName = handleGetNameFile(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE, newName + '.jpg')
        await sharp(file.filepath).jpeg({ quality: 100 }).toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: `http://localhost:4000/images/${newName}.jpg`,
          type: MediaTypes.Image
        }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result = await Promise.all(
      files.map(async (file) => {
        return {
          url: `http://localhost:4000/videos/${file.newFilename}`,
          type: MediaTypes.Video
        }
      })
    )
    return result
  }

  async uploadAvatar(req: Request) {
    const files = await handleUploadAvatar(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const newName = handleGetNameFile(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE, newName + '.jpg')
        await sharp(file.filepath).jpeg({ quality: 100 }).toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: `http://localhost:4000/images/${newName}.jpg`
        }
      })
    )
    return result
  }

  async uploadCoverPhoto(req: Request) {
    const files = await handleUploadAvatar(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const newName = handleGetNameFile(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE, newName + '.jpg')
        await sharp(file.filepath).jpeg({ quality: 100 }).toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: `http://localhost:4000/images/${newName}.jpg`
        }
      })
    )
    return result
  }
}

const mediaService = new MediaService()
export default mediaService
