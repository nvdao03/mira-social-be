import { verify } from 'crypto'
import { Router } from 'express'
import {
  getProfileController,
  getUserNotFollowerSuggestionsController,
  getPostProfileController,
  getLikePostProfileController,
  updateProfileController
} from '~/controllers/user.controller'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { filterMiddleware } from '~/middlewares/common.middleware'
import { updateProfileValidator } from '~/middlewares/user.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

export const userRouter = Router()

userRouter.get('/suggestions', accessTokenValidator, wrapHandler(getUserNotFollowerSuggestionsController))
userRouter.put(
  '/:user_id',
  accessTokenValidator,
  updateProfileValidator,
  verifyUserValidator,
  filterMiddleware(['name', 'bio', 'location', 'website', 'date_of_birth', 'avatar', 'cover_photo']),
  wrapHandler(updateProfileController)
)
userRouter.get('/:id', accessTokenValidator, wrapHandler(getProfileController))
userRouter.get('/:user_id/posts', accessTokenValidator, wrapHandler(getPostProfileController))
userRouter.get('/:user_id/likes', accessTokenValidator, wrapHandler(getLikePostProfileController))
