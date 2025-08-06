import { NextFunction, Request, Response } from 'express'

export const signUpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: 'Sign up successfully' })
  } catch (error) {
    next(error)
  }
}
