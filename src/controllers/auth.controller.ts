import { UserType } from './../models/user.model'
import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { pick } from 'lodash'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { MESSAGE } from '~/constants/message'
import { SignInRequestBody, SignUpRequestBody } from '~/requests/auth.request'
import authService from '~/services/auth.service'

export const signUpController = async (
  req: Request<ParamsDictionary, any, SignUpRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await authService.signUp(req.body)
  const { access_token, refresh_token, user } = result
  return res.status(HTTP_STATUS.OK).json({
    message: MESSAGE.ACCOUNT_CREATED_SUCCESSFULLY,
    data: {
      access_token,
      refresh_token,
      user: pick(user, ['_id', 'email', 'username', 'name', 'avatar', 'created_at', 'updated_at'])
    }
  })
}

export const signInController = async (
  req: Request<ParamsDictionary, any, SignInRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserType
  const user_id = user._id
  const result = await authService.signIn({ user_id: user_id.toString(), verify: user.verify })
  const { access_token, refresh_token, userResponse } = result
  return res.status(HTTP_STATUS.OK).json({
    message: MESSAGE.SIGN_IN_SUCCESSFULLY,
    data: {
      access_token,
      refresh_token,
      user: pick(userResponse, ['_id', 'email', 'username', 'name', 'avatar', 'created_at', 'updated_at'])
    }
  })
}
