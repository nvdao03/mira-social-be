import { Router } from 'express'
import { searchController } from '~/controllers/search.controller'
import { searchValidator } from '~/middlewares/search.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

export const searchRouter = Router()

searchRouter.get('/', searchValidator, wrapHandler(searchController))
