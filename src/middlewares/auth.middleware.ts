import { checkSchema } from 'express-validator'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { MESSAGE } from '~/constants/message'
import { UserModel } from '~/models/user.model'
import authService from '~/services/auth.service'
import hasspassword from '~/utils/crypto'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

export const signUpValidation = validate(
  checkSchema(
    {
      email: {
        isEmail: true,
        notEmpty: {
          errorMessage: MESSAGE.EMAIL_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isEmail = await authService.checkEmailExits(value)
            if (isEmail) {
              throw new ErrorStatus({
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                message: MESSAGE.EMAIL_ALREADY_EXISTS
              })
            }
            return true
          }
        }
      },
      password: {
        isString: true,
        notEmpty: {
          errorMessage: MESSAGE.PASSWORD_REQUIRED
        },
        isLength: {
          options: {
            min: 6,
            max: 180
          },
          errorMessage: MESSAGE.PASSWORD_LENGTH
        },
        trim: true
      },
      username: {
        isString: true,
        notEmpty: {
          errorMessage: MESSAGE.USERNAME_REQUIRED
        },
        isLength: {
          options: {
            min: 3,
            max: 50
          },
          errorMessage: MESSAGE.USERNAME_LENGTH
        },
        custom: {
          options: async (value) => {
            const isUserName = await authService.checkUserNameExits(value)
            if (isUserName) {
              throw new ErrorStatus({
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                message: MESSAGE.USER_NAME_ALREADY_EXISTS
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
          errorMessage: MESSAGE.COUNTRY_REQUIRED
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
          errorMessage: MESSAGE.EMAIL_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await UserModel.findOne({ email: value, password: hasspassword(req.body.password) })
            if (!user) {
              throw new Error(MESSAGE.INVALID_EMAIL_OR_PASSWORD)
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        isString: true,
        notEmpty: {
          errorMessage: MESSAGE.PASSWORD_REQUIRED
        },
        isLength: {
          options: {
            min: 6,
            max: 180
          },
          errorMessage: MESSAGE.PASSWORD_LENGTH
        },
        trim: true
      }
    },
    ['body']
  )
)
