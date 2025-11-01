import { Router, Request, Response, NextFunction } from 'express'

const healthRouter = Router()

healthRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json({
      status: 'ok',
      message: 'Server and Database are running 🚀'
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Server is running but cannot connect to Database ❌'
    })
  }
})

export default healthRouter
