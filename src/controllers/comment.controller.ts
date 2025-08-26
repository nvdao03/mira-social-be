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
export const getCommentsController = (req: Request, res: Response, next: NextFunction) => {}
export const deleteCommentController = (req: Request, res: Response, next: NextFunction) => {}
export const updateCommentController = (req: Request, res: Response, next: NextFunction) => {}
