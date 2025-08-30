import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import userService from '~/services/user.service'
import { PostQuery } from '~/requests/post.request'

export const getUserNotFollowerSuggestionsController = async (
  req: Request<ParamsDictionary, any, any, PostQuery>,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.decoded_authorization?.user_id as string
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const result = await userService.getUserNotFollowerSuggestions({ user_id, limit, page })
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.GET_USER_SUGGESTIONS_SUCCESSFULLY,
    data: {
      users: result.users,
      pagination: {
        page,
        limit,
        total_page: result.total_page
      }
    }
  })
}

export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const user = await userService.getProfile(id)
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.GET_PROFILE_SUCCESSFULLY,
    data: user
  })
}

export const getPostProfileController = async (
  req: Request<ParamsDictionary, any, any, PostQuery>,
  res: Response,
  next: NextFunction
) => {
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const user_id_login = req.decoded_authorization?.user_id as string
  const { user_id } = req.params
  const result = await userService.getPostProfile({ user_id, limit, page, user_id_login })
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

export const getLikePostProfileController = async (
  req: Request<ParamsDictionary, any, any, PostQuery>,
  res: Response,
  next: NextFunction
) => {
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const { user_id } = req.params
  const user_id_login = req.decoded_authorization?.user_id as string
  const result = await userService.getLikePostProfile({ user_id, limit, page, user_id_login })
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
