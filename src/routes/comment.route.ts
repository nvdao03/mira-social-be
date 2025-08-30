import { Router } from 'express'
import { commentController, deleteCommentController, getCommentsController } from '~/controllers/comment.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { commentValidator } from '~/middlewares/comment.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

export const commentRouter = Router()

commentRouter.get('/post/:post_id', accessTokenValidator, wrapHandler(getCommentsController))
commentRouter.post('/:post_id', accessTokenValidator, commentValidator, wrapHandler(commentController))
commentRouter.delete('/:comment_id', accessTokenValidator, wrapHandler(deleteCommentController))
