import { checkSchema } from 'express-validator'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { COMMENT_MESSAGE } from '~/constants/message'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

export const commentValidator = validate(
  checkSchema({
    content: {
      trim: true,
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new ErrorStatus({
              message: COMMENT_MESSAGE.CONTENT_REQUIRED,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          return true
        }
      }
    }
  })
)
