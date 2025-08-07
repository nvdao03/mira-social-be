import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { pick } from 'lodash'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { MESSAGE } from '~/constants/message'
import { SignUpRequestBody } from '~/requests/auth.request'
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
