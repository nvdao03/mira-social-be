import { Router } from 'express'
import { likeController, unlikeController } from '~/controllers/like.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { likeMiddleware } from '~/middlewares/like.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

export const likeRouter = Router()

likeRouter.post('/', accessTokenValidator, likeMiddleware, wrapHandler(likeController))
likeRouter.delete('/post/:post_id', accessTokenValidator, likeMiddleware, wrapHandler(unlikeController))
