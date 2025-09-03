import { Router, Request, Response, NextFunction } from 'express'
import {
  changePasswordController,
  forgotPasswordController,
  logoutController,
  refreshTokenController,
  resetPasswordController,
  signInController,
  signUpController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/auth.controller'
import {
  accessTokenValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  refreshTokenValidator,
  resetPasswordValidator,
  signInValidation,
  signUpValidation,
  verifyEmailValidator,
  verifyForgotPasswordToken
} from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

const authRouter = Router()

authRouter.post('/sign-up', signUpValidation, wrapHandler(signUpController))
authRouter.post('/sign-in', signInValidation, wrapHandler(signInController))
authRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapHandler(logoutController))
authRouter.post('/refresh-token', refreshTokenValidator, wrapHandler(refreshTokenController))
authRouter.post('/verify-email', verifyEmailValidator, wrapHandler(verifyEmailController))
authRouter.post('/forgot-password', forgotPasswordValidator, wrapHandler(forgotPasswordController))
authRouter.post('/verify-forgot-password', verifyForgotPasswordToken, wrapHandler(verifyForgotPasswordController))
authRouter.post('/reset-password', resetPasswordValidator, wrapHandler(resetPasswordController))
authRouter.post(
  '/change-password',
  accessTokenValidator,
  changePasswordValidator,
  wrapHandler(changePasswordController)
)

export default authRouter
