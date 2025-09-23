import { NextFunction, Response, Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { FOLLOWER_MESSAGE } from '~/constants/message'
import { FollowRequestBody } from '~/requests/follower.request'
import followerService from '~/services/follower.service'

export const followerController = async (
  req: Request<ParamsDictionary, any, FollowRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.decoded_authorization?.user_id as string
  const { followed_user_id } = req.body
  const result = await followerService.follow({ user_id, followed_user_id })
  return res.status(HTTP_STATUS.OK).json({
    message: FOLLOWER_MESSAGE.FOLLOW_USER_SUCCESSFULLY,
    data: result
  })
}

export const unfollowerController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.decoded_authorization?.user_id as string
  const { followed_user_id } = req.params
  const result = await followerService.unfollow({ user_id, followed_user_id })
  return res.status(HTTP_STATUS.OK).json({
    message: FOLLOWER_MESSAGE.UNFOLLOW_USER_SUCCESSFULLY,
    data: result
  })
}

export const getFollowerController = async (req: Request, res: Response, next: NextFunction) => {
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const user_id = req.params.user_id as string
  const result = await followerService.getFollower({ user_id, limit, page })
  return res.status(HTTP_STATUS.OK).json({
    message: FOLLOWER_MESSAGE.GET_FOLLOWERS_SUCCESSFULLY,
    data: {
      followers: result.followers,
      pagination: {
        page,
        limit,
        total_page: result.total_page
      }
    }
  })
}

export const getFollowingsController = async (req: Request, res: Response, next: NextFunction) => {
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const user_id = req.params.user_id as string
  const result = await followerService.getFollowings({ user_id, limit, page })
  return res.status(HTTP_STATUS.OK).json({
    message: FOLLOWER_MESSAGE.GET_FOLLOWINGS_SUCCESSFULLY,
    data: {
      followings: result.following,
      pagination: {
        page,
        limit,
        total_page: result.total_page
      }
    }
  })
}
