import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import userService from '~/services/user.service'
import { PostQuery } from '~/requests/post.request'

export const getUserSuggestions = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decoded_authorization?.user_id as string
  const result = await userService.getUserSuggestions(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.GET_USER_SUGGESTIONS_SUCCESSFULLY,
    data: result
  })
}

export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decoded_authorization?.user_id as string
  const user = await userService.getProfile(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.GET_PROFILE_SUCCESSFULLY,
    data: user
  })
}

export const getUserProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decoded_authorization?.user_id as string
  const { username } = req.params
  const user = await userService.getProfileUserName({ user_id, username })
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.GET_PROFILE_SUCCESSFULLY,
    data: user
  })
}

export const getUserPostController = async (
  req: Request<ParamsDictionary, any, any, PostQuery>,
  res: Response,
  next: NextFunction
) => {
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const user_id = req.decoded_authorization?.user_id as string
  const { username } = req.params
  const result = await userService.getUserPosts({ user_id, username, limit, page })
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.GET_USER_POSTS_SUCCESSFULLY,
    data: {
      posts: result.posts,
      pagination: {
        page,
        limit,
        total_page: result.total_page
      }
    }
  })
}

export const getUserLikePostsController = async (
  req: Request<ParamsDictionary, any, any, PostQuery>,
  res: Response,
  next: NextFunction
) => {
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const user_id = req.decoded_authorization?.user_id as string
  const { username } = req.params
  const result = await userService.getUserLikePosts({ user_id, username, limit, page })
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.GET_USER_POSTS_SUCCESSFULLY,
    data: {
      posts: result.posts,
      pagination: {
        page,
        limit,
        total_page: result.total_page
      }
    }
  })
}
