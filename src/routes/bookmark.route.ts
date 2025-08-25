import { Router } from 'express'
import { bookmarkController, unBookmarkController } from '~/controllers/bookmark.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { bookmarkMiddleware } from '~/middlewares/bookmark.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

export const bookmarkRouter = Router()

bookmarkRouter.post('/', accessTokenValidator, bookmarkMiddleware, wrapHandler(bookmarkController))
bookmarkRouter.delete('/post/:post_id', accessTokenValidator, bookmarkMiddleware, wrapHandler(unBookmarkController))
