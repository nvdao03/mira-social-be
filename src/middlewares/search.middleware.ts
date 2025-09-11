import { checkSchema } from 'express-validator'
import { USER_MESSAGE } from '~/constants/message'
import { validate } from '~/utils/validation'

export const searchValidator = validate(
  checkSchema(
    {
      key: {
        trim: true,
        isString: {
          errorMessage: USER_MESSAGE.SEARCH_INVALID
        }
      }
    },
    ['query']
  )
)
