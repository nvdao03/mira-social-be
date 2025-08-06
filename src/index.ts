import { config } from 'dotenv'
import express from 'express'
import mongodbConfig from '~/configs/mongodb.config'
import errorHandler from '~/middlewares/error.middleware'
import authRouter from '~/routes/auth.route'

config()

const app = express()

const PORT = process.env.PORT || 4000

mongodbConfig.connect()

app.use(express.json())

app.use('/auth', authRouter)

app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
