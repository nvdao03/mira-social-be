import { checkSchema } from 'express-validator'
import mongoose from 'mongoose'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { FOLLOWER_MESSAGE } from '~/constants/message'
import { UserModel } from '~/models/user.model'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

export const followerValidator = validate(
  checkSchema(
    {
      followed_user_id: {
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: FOLLOWER_MESSAGE.FOLLOWED_USER_ID_REQUIRED,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            if (!mongoose.Types.ObjectId.isValid(value)) {
              throw new ErrorStatus({
                message: FOLLOWER_MESSAGE.FOLLOWED_USER_ID_INVALID,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const user = await UserModel.findById(value)
            if (!user) {
              throw new ErrorStatus({
                message: FOLLOWER_MESSAGE.FOLLOWER_USER_ID_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
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

export const unfollowerValidator = validate(
  checkSchema(
    {
      followed_user_id: {
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: FOLLOWER_MESSAGE.FOLLOWED_USER_ID_REQUIRED,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            if (!mongoose.Types.ObjectId.isValid(value)) {
              throw new ErrorStatus({
                message: FOLLOWER_MESSAGE.FOLLOWED_USER_ID_INVALID,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const user = await UserModel.findById(value)
            if (!user) {
              throw new ErrorStatus({
                message: FOLLOWER_MESSAGE.FOLLOWER_USER_ID_NOT_FOUND,
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
