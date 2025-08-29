import { Router } from 'express'
import {
  followerController,
  getFollowerController,
  getFollowingsController,
  unfollowerController
} from '~/controllers/follower.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import {
  followerValidator,
  getfollowerValidator,
  getfollowingValidator,
  unfollowerValidator
} from '~/middlewares/follower.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

const followerRouter = Router()

followerRouter.post('/', accessTokenValidator, followerValidator, wrapHandler(followerController))
followerRouter.get(
  '/:user_id/followers',
  accessTokenValidator,
  getfollowerValidator,
  wrapHandler(getFollowerController)
)
followerRouter.get(
  '/:user_id/followings',
  accessTokenValidator,
  getfollowingValidator,
  wrapHandler(getFollowingsController)
)
followerRouter.delete(
  '/user/:followed_user_id',
  accessTokenValidator,
  unfollowerValidator,
  wrapHandler(unfollowerController)
)

export default followerRouter
