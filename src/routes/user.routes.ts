import { Router } from 'express'
import {
  getProfileController,
  getUserNotFollowerSuggestionsController,
  getPostProfileController,
  getLikePostProfileController,
  getRepostProfileController
} from '~/controllers/user.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

export const userRouter = Router()

userRouter.get('/suggestions', accessTokenValidator, wrapHandler(getUserNotFollowerSuggestionsController))
userRouter.get('/:id', accessTokenValidator, wrapHandler(getProfileController))
userRouter.get('/:user_id/posts', accessTokenValidator, wrapHandler(getPostProfileController))
userRouter.get('/:user_id/likes', accessTokenValidator, wrapHandler(getLikePostProfileController))
