import { Router } from 'express'
import { bookmarkController, getBookmarksController, unBookmarkController } from '~/controllers/bookmark.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { bookmarkMiddleware } from '~/middlewares/bookmark.middleware'
import { wrapHandler } from '~/utils/wrapHandler'

export const bookmarkRouter = Router()

bookmarkRouter.get('/', accessTokenValidator, wrapHandler(getBookmarksController))
bookmarkRouter.post('/', accessTokenValidator, bookmarkMiddleware, wrapHandler(bookmarkController))
bookmarkRouter.delete('/post/:post_id', accessTokenValidator, bookmarkMiddleware, wrapHandler(unBookmarkController))
