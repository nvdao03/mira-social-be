import { Router } from 'express'
import authRouter from '~/routes/auth.route'
import { mediaRouter } from '~/routes/media.route'
import { postRouter } from '~/routes/post.route'
import { likeRouter } from '~/routes/like.route'
import { bookmarkRouter } from '~/routes/bookmark.route'
import { commentRouter } from '~/routes/comment.route'
import { userRouter } from '~/routes/user.routes'
import followerRouter from '~/routes/follower.route'
import { searchRouter } from '~/routes/search.route'
import healthRouter from '~/routes/health.route'

const router = Router()

router.use('/auth', authRouter)
router.use('/medias', mediaRouter)
router.use('/posts', postRouter)
router.use('/likes', likeRouter)
router.use('/bookmarks', bookmarkRouter)
router.use('/comments', commentRouter)
router.use('/users', userRouter)
router.use('/follows', followerRouter)
router.use('/search', searchRouter)
router.use('/health', healthRouter)

export default router
