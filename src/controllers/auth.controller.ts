import { UserModel, UserType } from './../models/user.model'
import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import mongoose from 'mongoose'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE, USER_MESSAGE } from '~/constants/message'
import {
  ChangePasswordRequestBody,
  ForgotPasswordRequestBody,
  LogoutRequest,
  RefreshTokenRequestBody,
  SignInRequestBody,
  SignUpRequestBody,
  TokenPayload,
  VerifyEmailRequestBody
} from '~/requests/auth.request'
import authService from '~/services/auth.service'
import { ErrorStatus } from '~/utils/Errors'
import '../configs/env.config'

export const signUpController = async (
  req: Request<ParamsDictionary, any, SignUpRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await authService.signUp(req.body)
  const { access_token, refresh_token, user } = result
  return res.status(HTTP_STATUS.OK).json({
    message: AUTH_MESSAGE.ACCOUNT_CREATED_SUCCESSFULLY,
    data: {
      access_token,
      refresh_token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        name: user.name || '',
        avatar: user.avatar || ''
      }
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
  const { access_token, refresh_token, user_res } = result
  return res.status(HTTP_STATUS.OK).json({
    message: AUTH_MESSAGE.SIGN_IN_SUCCESSFULLY,
    data: {
      access_token,
      refresh_token,
      user: {
        id: user_res._id,
        email: user_res.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar || ''
      }
    }
  })
}

export const oauthController = async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.query
  const { access_token, refresh_token, user } = await authService.oauth(code as string)
  const urlRedirect = `${process.env.GOOGLE_CLIENT_REDIRECT_URL}?access_token=${access_token}&refresh_token=${refresh_token}&id=${user._id.toString()}&email=${encodeURIComponent(user.email)}&username=${encodeURIComponent(user.username)}&name=${encodeURIComponent(user.name)}&avatar=${encodeURIComponent(user.avatar || '')}`
  return res.redirect(urlRedirect)
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutRequest>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const result = await authService.logout(refresh_token)
  return res.status(HTTP_STATUS.OK).json(result)
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const { user_id, verify, exp } = req.decoded_refresh_token as TokenPayload
  const result = await authService.refreshToken({ user_id, verify, refresh_token, exp })
  return res.status(HTTP_STATUS.OK).json({
    message: AUTH_MESSAGE.REFRESH_TOKEN_SUCCESSFULLY,
    data: result
  })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(user_id) })
  if (!user) {
    throw new ErrorStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: USER_MESSAGE.USER_NOT_FOUND
    })
  }
  if (user.email_verify_token === '') {
    throw new ErrorStatus({
      status: HTTP_STATUS.BAD_REQUEST,
      message: AUTH_MESSAGE.EMAIL_VERIFIED_BEFORE
    })
  }
  const result = await authService.verifyEmail(user_id)
  const { access_token, refresh_token, user_res } = result
  return res.status(HTTP_STATUS.OK).json({
    message: AUTH_MESSAGE.EMAIL_VERIFIED_SUCCESSFULLY,
    data: {
      access_token,
      refresh_token,
      user: {
        id: user_res._id,
        email: user_res.email,
        username: user_res.username,
        name: user_res.name,
        avatar: user_res.avatar || ''
      }
    }
  })
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyEmailRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserType
  const result = await authService.forgotPassword(user)
  return res.status(HTTP_STATUS.OK).json({
    message: result.message
  })
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  return res.status(HTTP_STATUS.OK).json({ message: AUTH_MESSAGE.VERIFY_FORGOT_PASSWORD_SUCCESSFULLY })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.decoded_forgot_password_token?.user_id as string
  const { password } = req.body
  const result = await authService.resetPassword({ user_id, password })
  return res.status(HTTP_STATUS.OK).json(result)
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.decoded_authorization?.user_id as string
  const { new_password } = req.body
  const result = await authService.changePassword({ user_id, new_password })
  return res.status(HTTP_STATUS.OK).json(result)
}
