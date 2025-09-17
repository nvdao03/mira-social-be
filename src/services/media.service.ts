import { Request } from 'express'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE } from '~/constants/dir'
import { MediaTypes } from '~/constants/enums'
import { handleUploadAvatar, handleUploadImage, handleUploadVideo } from '~/utils/file'
import { handleGetNameFile } from '~/utils/other'
import uploadFileToS3 from '~/utils/s3'
import mime from 'mime-types'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'

class MediaService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const newFileName = handleGetNameFile(file.newFilename)
        const newFileFullName = `${newFileName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE, `${newFileName}.jpg`)
        await sharp(file.filepath).jpeg({ quality: 100 }).toFile(newPath)
        const s3 = await uploadFileToS3({
          fileName: 'images/' + newFileFullName,
          filePath: newPath,
          contentType: mime.contentType(newPath) as string
        })
        await Promise.all([fsPromises.unlink(file.filepath), fsPromises.unlink(newPath)])
        return {
          url: (s3 as CompleteMultipartUploadCommandOutput).Location as string,
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
        const s3 = await uploadFileToS3({
          fileName: 'videos/' + file.newFilename,
          filePath: file.filepath,
          contentType: file.mimetype as string
        })
        await fsPromises.unlink(file.filepath)
        return {
          url: (s3 as CompleteMultipartUploadCommandOutput).Location as string,
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
        const newFileName = handleGetNameFile(file.newFilename)
        const newFileFullName = `${newFileName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE, `${newFileName}.jpg`)
        await sharp(file.filepath).jpeg({ quality: 100 }).toFile(newPath)
        const s3 = await uploadFileToS3({
          fileName: 'images/' + newFileFullName,
          filePath: newPath,
          contentType: mime.contentType(newPath) as string
        })
        await Promise.all([fsPromises.unlink(file.filepath), fsPromises.unlink(newPath)])
        return {
          url: (s3 as CompleteMultipartUploadCommandOutput).Location as string
        }
      })
    )
    return result
  }

  async uploadCoverPhoto(req: Request) {
    const files = await handleUploadAvatar(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const newFileName = handleGetNameFile(file.newFilename)
        const newFileFullName = `${newFileName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE, `${newFileName}.jpg`)
        await sharp(file.filepath).jpeg({ quality: 100 }).toFile(newPath)
        const s3 = await uploadFileToS3({
          fileName: 'images/' + newFileFullName,
          filePath: newPath,
          contentType: mime.contentType(newPath) as string
        })
        await Promise.all([fsPromises.unlink(file.filepath), fsPromises.unlink(newPath)])
        return {
          url: (s3 as CompleteMultipartUploadCommandOutput).Location as string
        }
      })
    )
    return result
  }
}

const mediaService = new MediaService()
export default mediaService
