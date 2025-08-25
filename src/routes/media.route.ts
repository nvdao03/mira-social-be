import { Router } from 'express'
import { uploadImageController, uploadVideoController } from '~/controllers/media.controller'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

export const mediaRouter = Router()

mediaRouter.post('/upload-image', accessTokenValidator, verifyUserValidator, wrapHandler(uploadImageController))
mediaRouter.post('/upload-video', accessTokenValidator, verifyUserValidator, wrapHandler(uploadVideoController))
