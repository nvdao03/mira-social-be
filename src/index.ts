import './configs/env.config'
import express from 'express'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yaml'
import fs from 'fs'
import cors from 'cors'
import mongodbConfig from '~/configs/mongodb.config'
import errorHandler from '~/middlewares/error.middleware'
import { initFolder } from '~/utils/file'
import { UPLOAD_IMAGE, UPLOAD_VIDEO } from '~/constants/dir'
import limiter from '~/configs/rateLimit.config'
import router from '~/routes'

const PORT = process.env.PORT || 4000

const app = express()

// --- Connect to MongoDB ---
mongodbConfig.connect()

// --- Middlewares ---
app.use(limiter)
app.use(express.json())
app.use(cors())

// --- Create folder upload ---
initFolder()

// --- Swagger document ---
const file = fs.readFileSync(path.resolve('mira-swagger.yaml'), 'utf-8')
const swaggerDocument = YAML.parse(file)
router.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// --- Routes ---
app.use(router)

// --- Static files ---
app.use('/images', express.static(path.resolve(UPLOAD_IMAGE)))
app.use('/videos', express.static(path.resolve(UPLOAD_VIDEO)))

// --- Error handler ---
app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
