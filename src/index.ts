import { config } from 'dotenv'
import express from 'express'
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

config()

const PORT = process.env.PORT || 4000

const app = express()

mongodbConfig.connect()
app.use(express.json())
app.use(cors())
initFolder()

app.use('/auth', authRouter)
app.use('/medias', mediaRouter)
app.use('/posts', postRouter)
app.use('/likes', likeRouter)
app.use('/bookmarks', bookmarkRouter)
app.use('/images', express.static(path.resolve(UPLOAD_IMAGE)))
app.use('/videos', express.static(path.resolve(UPLOAD_VIDEO)))
app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
