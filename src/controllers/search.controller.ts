import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { SEARCH_MESSAGE } from '~/constants/message'
import { SearchRequestQuery } from '~/requests/search.request'
import searchService from '~/services/search.service'

export const searchController = async (
  req: Request<any, any, any, SearchRequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const page = Number(req.query.page as string)
  const limit = Number(req.query.limit as string)
  const key = req.query.key as string
  const result = await searchService.search({ page, limit, key })
  return res.status(HTTP_STATUS.OK).json({
    message: SEARCH_MESSAGE.GET_USERS_SUCCESSFULLY,
    data: {
      users: result.data,
      pagination: {
        page,
        limit,
        total_page: result.total_page
      }
    }
  })
}
