import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongodbConfig from '~/configs/mongodb.config'
import errorHandler from '~/middlewares/error.middleware'
import authRouter from '~/routes/auth.route'

config()

const PORT = process.env.PORT || 4000

const app = express()

mongodbConfig.connect()
app.use(express.json())
app.use(cors())

app.use('/auth', authRouter)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
