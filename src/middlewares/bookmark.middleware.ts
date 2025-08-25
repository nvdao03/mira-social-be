import { checkSchema } from 'express-validator'
import mongoose from 'mongoose'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { POST_MESSAGE } from '~/constants/message'
import { PostModel } from '~/models/post.model'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

export const bookmarkMiddleware = validate(
  checkSchema({
    post_id: {
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new ErrorStatus({
              message: POST_MESSAGE.POST_ID_REQUIRED,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new ErrorStatus({
              message: POST_MESSAGE.POST_ID_INVALID,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          const post = await PostModel.findById(value)
          if (!post) {
            throw new ErrorStatus({
              message: POST_MESSAGE.POST_NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          return true
        }
      }
    }
  })
)
