import { checkSchema } from 'express-validator'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import { UserModel } from '~/models/user.model'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

export const getUserProfileValidator = validate(
  checkSchema(
    {
      username: {
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: USER_MESSAGE.USERNAME_REQUIRED,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const user = await UserModel.findOne({ username: value })
            if (!user) {
              throw new ErrorStatus({
                message: USER_MESSAGE.USERNAME_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
