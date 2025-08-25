import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { MEDIA_MESSAGE } from '~/constants/message'
import mediaService from '~/services/media.service'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaService.uploadImage(req)
  return res.status(HTTP_STATUS.OK).json({
    message: MEDIA_MESSAGE.UPLOAD_IMAGE_SUCCESSFULLY,
    data: result
  })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaService.uploadVideo(req)
  return res.status(HTTP_STATUS.OK).json({
    message: MEDIA_MESSAGE.UPLOAD_VIDEO_SUCCESSFULLY,
    data: result
  })
}
