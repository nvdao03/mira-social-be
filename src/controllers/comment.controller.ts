import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { COMMENT_MESSAGE } from '~/constants/message'
import commentService from '~/services/comment.service'

export const commentController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { post_id } = req.params
  const user_id = req.decoded_authorization?.user_id as string
  const { content } = req.body
  const result = await commentService.comment({ post_id, user_id, content })
  return res.status(HTTP_STATUS.OK).json({
    message: COMMENT_MESSAGE.COMMENT_POST_SUCCESSFULLY,
    data: result
  })
}
export const getCommentsController = async (req: Request, res: Response, next: NextFunction) => {
  const { post_id } = req.params
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const result = await commentService.getComments({ post_id, limit, page })
  return res.status(HTTP_STATUS.OK).json({
    message: COMMENT_MESSAGE.GET_COMMENTS_SUCCESSFULLY,
    data: {
      comments: result.comments,
      pagination: {
        page,
        limit,
        total_page: result.total_page
      }
    }
  })
}
export const deleteCommentController = async (req: Request, res: Response, next: NextFunction) => {
  const { comment_id } = req.params
  const result = await commentService.deleteComment(comment_id)
  return res.status(HTTP_STATUS.OK).json({ message: COMMENT_MESSAGE.DELETE_COMMENT_SUCCESSFULLY, data: result })
}
