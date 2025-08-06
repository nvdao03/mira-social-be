import { checkSchema } from 'express-validator'
import { MESSAGE } from '~/constants/message'
import authService from '~/services/auth.service'
import { validate } from '~/utils/validation'

export const signUpValidation = validate(
  checkSchema({
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
            throw new Error(MESSAGE.EMAIL_ALREADY_EXISTS)
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
      trim: true
    },
    country: {
      isString: true,
      notEmpty: {
        errorMessage: MESSAGE.COUNTRY_REQUIRED
      },
      trim: true
    }
  })
)
