import { config } from 'dotenv'
import mongoose from 'mongoose'
import { TokenTypes, UserVerifyStatus } from '~/constants/enums'
import { MESSAGE } from '~/constants/message'
import { RefreshTokenModel } from '~/models/refresh-token.model'
import { UserModel } from '~/models/user.model'
import { SignUpRequestBody } from '~/requests/auth.request'
import hasspassword from '~/utils/crypto'
import { signToken } from '~/utils/jwt'

config()

class AuthService {
  private async signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenTypes.AccessToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as any
      }
    })
  }

  private async signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenTypes.RefreshToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.FRESH_TOKEN_EXPIRES_IN as any
      }
    })
  }

  private async signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenTypes.EmailVerifyToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as any,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as any
      }
    })
  }

  async checkEmailExits(email: string) {
    const user = await UserModel.findOne({ email })
    return Boolean(user)
  }

  async checkUserNameExits(username: string) {
    const user = await UserModel.findOne({ username })
    return Boolean(user)
  }

  async signAccessTokenAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return await Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  async signUp(payload: SignUpRequestBody) {
    const user_id = new mongoose.Types.ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverifyed
    })
    const user = await UserModel.create({
      ...payload,
      _id: user_id,
      password: hasspassword(payload.password),
      verify: UserVerifyStatus.Unverifyed,
      email_verify_token: email_verify_token
    })
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id: user._id.toString(),
      verify: UserVerifyStatus.Unverifyed
    })
    const refresh_tokens = await RefreshTokenModel.create({
      user_id: user._id,
      token: refresh_token
    })
    refresh_tokens.save()
    user.save()
    return { access_token, refresh_token, user }
  }

  async signIn({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({ user_id, verify })

    await RefreshTokenModel.insertOne({ user_id, token: refresh_token })

    const userResponse = await UserModel.findOne({
      _id: new mongoose.Types.ObjectId(user_id)
    })

    return { access_token, refresh_token, userResponse }
  }

  async logout(refresh_token: string) {
    await RefreshTokenModel.deleteOne({ token: refresh_token })
    return { message: MESSAGE.LOGOUT_SUCCESSFULLY }
  }
}

const authService = new AuthService()
export default authService
