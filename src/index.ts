import './configs/env.config'
import express from 'express'
import fs from 'fs'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yaml'
import cors from 'cors'
import mongodbConfig from '~/configs/mongodb.config'
import errorHandler from '~/middlewares/error.middleware'
import authRouter from '~/routes/auth.route'
import { mediaRouter } from '~/routes/media.route'
import { initFolder } from '~/utils/file'
import path from 'path'
import { UPLOAD_IMAGE, UPLOAD_VIDEO } from '~/constants/dir'
import { postRouter } from '~/routes/post.route'
import { likeRouter } from '~/routes/like.route'
import { bookmarkRouter } from '~/routes/bookmark.route'
import { commentRouter } from '~/routes/comment.route'
import { userRouter } from '~/routes/user.routes'
import followerRouter from '~/routes/follower.route'
import { searchRouter } from '~/routes/search.route'

const PORT = process.env.PORT || 4000

const app = express()

mongodbConfig.connect()

app.use(express.json())

app.use(cors())

initFolder()

const file = fs.readFileSync(path.resolve('mira-swagger.yaml'), 'utf-8')
const swaggerDocument = YAML.parse(file)

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/auth', authRouter)
app.use('/medias', mediaRouter)
app.use('/posts', postRouter)
app.use('/likes', likeRouter)
app.use('/bookmarks', bookmarkRouter)
app.use('/comments', commentRouter)
app.use('/users', userRouter)
app.use('/follows', followerRouter)
app.use('/search', searchRouter)
app.use('/images', express.static(path.resolve(UPLOAD_IMAGE)))
app.use('/videos', express.static(path.resolve(UPLOAD_VIDEO)))
app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
