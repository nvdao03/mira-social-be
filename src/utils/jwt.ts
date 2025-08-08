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

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as jwt.JwtPayload)
    })
  })
}
