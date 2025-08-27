import { Router } from 'express'
import { followerController, unfollowerController } from '~/controllers/follower.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { followerValidator, unfollowerValidator } from '~/middlewares/follower.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

const followerRouter = Router()

followerRouter.post('/', accessTokenValidator, followerValidator, wrapHandler(followerController))
followerRouter.delete(
  '/user/:followed_user_id',
  accessTokenValidator,
  unfollowerValidator,
  wrapHandler(unfollowerController)
)

export default followerRouter
