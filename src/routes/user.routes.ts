import { Router } from 'express'
import {
  getProfileController,
  getUserLikePostsController,
  getUserPostController,
  getUserProfileController,
  getUserSuggestions
} from '~/controllers/user.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

export const userRouter = Router()

userRouter.get('/:username/posts', accessTokenValidator, wrapHandler(getUserPostController))
userRouter.get('/:username/likes', accessTokenValidator, wrapHandler(getUserLikePostsController))
userRouter.get('/suggestions', accessTokenValidator, wrapHandler(getUserSuggestions))
userRouter.get('/profile/me', accessTokenValidator, wrapHandler(getProfileController))
userRouter.get('/profile/:username', accessTokenValidator, wrapHandler(getUserProfileController))
