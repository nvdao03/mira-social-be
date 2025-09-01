import mongoose, { ObjectId } from 'mongoose'
import { checkSchema } from 'express-validator'
import { PostTypes } from '~/constants/enums'
import { POST_MESSAGE } from '~/constants/message'
import { handleEnumToArray } from '~/utils/other'
import { validate } from '~/utils/validation'
import { ErrorStatus } from '~/utils/Errors'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { PostModel } from '~/models/post.model'

const postType = handleEnumToArray(PostTypes)

export const createPostValidator = validate(
  checkSchema(
    {
      type: {
        isIn: {
          options: [postType],
          errorMessage: POST_MESSAGE.POST_TYPE_INVALID
        }
      },
      parent_id: {
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as PostTypes
            if (type === PostTypes.RePost && !mongoose.Types.ObjectId.isValid(value)) {
              throw new Error(POST_MESSAGE.PARENT_ID_REQUIRED)
            }
            if (type === PostTypes.Post && value !== null) {
              throw new Error(POST_MESSAGE.PARENT_ID_NOT_REQUIRED)
            }
            return true
          }
        }
      },
      content: {
        trim: true,
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as PostTypes
            if (type === PostTypes.RePost && value !== null) {
              throw new Error(POST_MESSAGE.CONTENT_NOT_REQUIRED)
            }
            return true
          }
        }
      },
      medias: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if (
              value.some((item: any) => {
                return typeof item.url !== 'string' && item.type !== PostTypes
              })
            ) {
              throw new Error(POST_MESSAGE.POST_TYPE_INVALID)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const postIdValidator = validate(
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
          const post = await PostModel.findById({ _id: new mongoose.Types.ObjectId(value) })
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
