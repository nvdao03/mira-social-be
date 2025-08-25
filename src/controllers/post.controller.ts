import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { POST_MESSAGE } from '~/constants/message'
import { TokenPayload } from '~/requests/auth.request'
import { CreatePostRequest } from '~/requests/post.request'
import postService from '~/services/post.service'

export const createPostController = async (
  req: Request<any, any, CreatePostRequest>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await postService.createPost({ user_id, body: req.body })
  return res.status(HTTP_STATUS.OK).json({
    message: POST_MESSAGE.CREATE_POST_SUCCESSFULLY,
    data: result
  })
}
