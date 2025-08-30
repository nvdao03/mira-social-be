import { Router } from 'express'
import {
  commentController,
  deleteCommentController,
  getCommentsController,
  updateCommentController
} from '~/controllers/comment.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { commentValidator } from '~/middlewares/comment.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

export const commentRouter = Router()

commentRouter.get('/post/:post_id', accessTokenValidator, wrapHandler(getCommentsController))
commentRouter.post('/:post_id', accessTokenValidator, commentValidator, wrapHandler(commentController))
commentRouter.put('/:post_id/:comment_id', accessTokenValidator, commentValidator, wrapHandler(updateCommentController))
commentRouter.delete(
  '/:post_id/:comment_id',
  accessTokenValidator,
  commentValidator,
  wrapHandler(deleteCommentController)
)
