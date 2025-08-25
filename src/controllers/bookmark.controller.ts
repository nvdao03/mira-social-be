import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { BOOKMARK_MESSAGE } from '~/constants/message'
import { TokenPayload } from '~/requests/auth.request'
import { BookmarkRequestBody } from '~/requests/bookmark.request'
import bookmarkService from '~/services/bookmark.service'

export const bookmarkController = async (
  req: Request<any, any, BookmarkRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { post_id } = req.body
  const result = await bookmarkService.bookmark({ post_id, user_id })
  return res.status(HTTP_STATUS.OK).json({
    message: BOOKMARK_MESSAGE.BOOKMARK_POST_SUCCESSFULLY,
    data: result
  })
}

export const unBookmarkController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { post_id } = req.params
  const result = await bookmarkService.unBookmark({ post_id, user_id })
  return res.status(HTTP_STATUS.OK).json({
    message: BOOKMARK_MESSAGE.UNBOOKMARK_POST_SUCCESSFULLY,
    data: result
  })
}
