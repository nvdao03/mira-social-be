import { Router, Request, Response, NextFunction } from 'express'
import {
  logoutController,
  refreshTokenController,
  signInController,
  signUpController
} from '~/controllers/auth.controller'
import {
  accessTokenValidator,
  refreshTokenValidator,
  signInValidation,
  signUpValidation
} from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

const authRouter = Router()

authRouter.post('/sign-up', signUpValidation, wrapHandler(signUpController))
authRouter.post('/sign-in', signInValidation, wrapHandler(signInController))
authRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapHandler(logoutController))
authRouter.post('/refresh-token', refreshTokenValidator, wrapHandler(refreshTokenController))

export default authRouter
