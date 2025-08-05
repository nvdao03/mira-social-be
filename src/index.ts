import { config } from 'dotenv'
import express from 'express'
import mongodbConfig from '~/configs/mongodb.config'

config()

const app = express()

const PORT = process.env.PORT || 4000

mongodbConfig.connect()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
