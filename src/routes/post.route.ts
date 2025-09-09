import { Router } from 'express'
import {
  createPostController,
  deletePostController,
  getPostDetailController,
  getPostsController,
  updatePostController
} from '~/controllers/post.controller'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { createPostValidator, postIdValidator } from '~/middlewares/post.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

export const postRouter = Router()

postRouter.post('/', accessTokenValidator, verifyUserValidator, createPostValidator, wrapHandler(createPostController))
postRouter.get('/', accessTokenValidator, wrapHandler(getPostsController))
postRouter.get('/post/:post_id', accessTokenValidator, wrapHandler(getPostDetailController))
postRouter.delete(
  '/:post_id',
  accessTokenValidator,
  verifyUserValidator,
  postIdValidator,
  wrapHandler(deletePostController)
)
postRouter.put(
  '/:post_id',
  accessTokenValidator,
  verifyUserValidator,
  postIdValidator,
  wrapHandler(updatePostController)
)
