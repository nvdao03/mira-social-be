import { Router, Request, Response, NextFunction } from 'express'
import { signInController, signUpController } from '~/controllers/auth.controller'
import { signInValidation, signUpValidation } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

const authRouter = Router()

authRouter.post('/sign-up', signUpValidation, wrapHandler(signUpController))
authRouter.post('/sign-in', signInValidation, wrapHandler(signInController))

export default authRouter
