import jwt, { SignOptions } from 'jsonwebtoken'
import mongoose from 'mongoose'

export const signToken = ({
  payload,
  privateKey,
  options
}: {
  payload: string | object | Buffer | mongoose.Types.ObjectId
  privateKey: string
  options: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        reject(error)
      }
      resolve(token as string)
    })
  })
}
