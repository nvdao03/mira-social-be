import { UserType } from './models/user.model'
declare module 'express' {
  interface Request {
    user?: UserType
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
