import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { LIKE_MESSAGE } from '~/constants/message'
import { TokenPayload } from '~/requests/auth.request'
import { LikeRequestBody } from '~/requests/like.request'
import likeService from '~/services/like.service'

export const likeController = async (req: Request<any, any, LikeRequestBody>, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { post_id } = req.body
  const result = await likeService.like({ post_id, user_id })
  return res.status(HTTP_STATUS.OK).json({
    message: LIKE_MESSAGE.LIKE_POST_SUCCESSFULLY,
    data: result
  })
}

export const unlikeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { post_id } = req.params
  const result = await likeService.unlike({ post_id, user_id })
  return res.status(HTTP_STATUS.OK).json({
    message: LIKE_MESSAGE.UNLIKE_POST_SUCCESSFULLY,
    data: result
  })
}
