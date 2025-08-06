import { Router, Request, Response, NextFunction } from 'express'
import { signUpController } from '~/controllers/auth.controller'
import { signUpValidation } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

const authRouter = Router()

authRouter.post('/sign-up', signUpValidation, wrapHandler(signUpController))

export default authRouter
