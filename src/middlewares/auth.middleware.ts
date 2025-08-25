import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { UserVerifyStatus } from '~/constants/enums'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE, USER_MESSAGE } from '~/constants/message'
import { RefreshTokenModel } from '~/models/refresh-token.model'
import { UserModel } from '~/models/user.model'
import { TokenPayload } from '~/requests/auth.request'
import authService from '~/services/auth.service'
import hasspassword from '~/utils/crypto'
import { ErrorStatus } from '~/utils/Errors'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const signUpValidation = validate(
  checkSchema(
    {
      email: {
        isEmail: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGE.EMAIL_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isEmail = await authService.checkEmailExits(value)
            if (isEmail) {
              throw new ErrorStatus({
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                message: AUTH_MESSAGE.EMAIL_ALREADY_EXISTS
              })
            }
            return true
          }
        }
      },
      password: {
        isString: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGE.PASSWORD_REQUIRED
        },
        isLength: {
          options: {
            min: 6,
            max: 180
          },
          errorMessage: AUTH_MESSAGE.PASSWORD_LENGTH
        },
        trim: true
      },
      username: {
        isString: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGE.USERNAME_REQUIRED
        },
        isLength: {
          options: {
            min: 3,
            max: 50
          },
          errorMessage: AUTH_MESSAGE.USERNAME_LENGTH
        },
        custom: {
          options: async (value) => {
            const isUserName = await authService.checkUserNameExits(value)
            if (isUserName) {
              throw new ErrorStatus({
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                message: AUTH_MESSAGE.USER_NAME_ALREADY_EXISTS
              })
            }
            return true
          }
        },
        trim: true
      },
      country: {
        isString: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGE.COUNTRY_REQUIRED
        },
        trim: true
      }
    },
    ['body']
  )
)

export const signInValidation = validate(
  checkSchema(
    {
      email: {
        isEmail: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGE.EMAIL_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await UserModel.findOne({ email: value, password: hasspassword(req.body.password) })
            if (!user) {
              throw new ErrorStatus({
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                message: AUTH_MESSAGE.INVALID_EMAIL_OR_PASSWORD
              })
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        isString: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGE.PASSWORD_REQUIRED
        },
        isLength: {
          options: {
            min: 6,
            max: 180
          },
          errorMessage: AUTH_MESSAGE.PASSWORD_LENGTH
        },
        trim: true
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const accessToken = (value || '').split(' ')[1]
            if (!accessToken) {
              throw new ErrorStatus({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: AUTH_MESSAGE.ACCESS_TOKEN_REQUIRED
              })
            }
            try {
              const decoded_authorization = await verifyToken({
                token: accessToken,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              req.decoded_authorization = decoded_authorization as TokenPayload
            } catch (error) {
              throw new ErrorStatus({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: AUTH_MESSAGE.ACCESS_TOKEN_NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        isString: true,
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: AUTH_MESSAGE.REFRESH_TOKEN_REQUIRED
              })
            }
            const [decoded_refresh_token, refresh_token] = await Promise.all([
              verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
              }),
              RefreshTokenModel.findOne({ token: value })
            ])
            try {
              if (!refresh_token) {
                throw new ErrorStatus({
                  status: HTTP_STATUS.UNAUTHORIZED,
                  message: AUTH_MESSAGE.REFRESH_TOKEN_NOT_FOUND
                })
              }
              req.decoded_refresh_token = decoded_refresh_token as TokenPayload
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorStatus({
                  status: HTTP_STATUS.UNAUTHORIZED,
                  message: AUTH_MESSAGE.REFRESH_TOKEN_REQUIRED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyEmailValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: AUTH_MESSAGE.EMAIL_VERIFY_TOKEN_REQUIRED
              })
            }
            try {
              const decoded_email_verify_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
              })
              req.decoded_email_verify_token = decoded_email_verify_token as TokenPayload
            } catch (error) {
              throw new ErrorStatus({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: AUTH_MESSAGE.EMAIL_VERIFY_TOKEN_NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyUserValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { verify } = req.decoded_authorization as TokenPayload
    if (verify !== UserVerifyStatus.Verifyed) {
      throw new ErrorStatus({
        status: HTTP_STATUS.FORBIDDEN,
        message: USER_MESSAGE.USER_NOT_VERIFY
      })
    }
    next()
  } catch (error) {
    next(error)
  }
}
