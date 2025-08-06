import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorEntity, ErrorStatus } from '~/utils/Errors'

export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validations.run(req) // check lỗi đưa vào biến req
    const errors = validationResult(req) // Trả về 1 mảng array object error nếu có lỗi
    if (errors.isEmpty()) {
      return next()
    }
    const errorsObject = errors.mapped() // Chuyển dổi mảng sang object
    const entityError = new ErrorEntity({
      errors: {}
    })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      if (msg instanceof ErrorStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        next(msg)
      }
      entityError.errors[key] = errorsObject[key].msg
    }
    next(entityError)
  }
}
