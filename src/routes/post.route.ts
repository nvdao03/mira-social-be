import { Router } from 'express'
import { createPostController, getPostsController } from '~/controllers/post.controller'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { createPostValidator } from '~/middlewares/post.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

export const postRouter = Router()

postRouter.post('/', accessTokenValidator, verifyUserValidator, createPostValidator, wrapHandler(createPostController))
postRouter.get('/', accessTokenValidator, wrapHandler(getPostsController))
