import { Router, Request, Response, NextFunction } from 'express'
import { logoutController, signInController, signUpController } from '~/controllers/auth.controller'
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

export default authRouter
