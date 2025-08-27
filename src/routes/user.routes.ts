import { Router } from 'express'
import { getUserSuggestions } from '~/controllers/user.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

export const userRouter = Router()

userRouter.get('/suggestions', accessTokenValidator, wrapHandler(getUserSuggestions))
