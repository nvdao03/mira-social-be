import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import userService from '~/services/user.service'

export const getUserSuggestions = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decoded_authorization?.user_id as string
  const result = await userService.getUserSuggestions(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.GET_USER_SUGGESTIONS_SUCCESSFULLY,
    data: result
  })
}
