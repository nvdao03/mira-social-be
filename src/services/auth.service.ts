import { verify } from 'node:crypto'
import { config } from 'dotenv'
import mongoose from 'mongoose'
import { TokenTypes, UserVerifyStatus } from '~/constants/enums'
import { AUTH_MESSAGE } from '~/constants/message'
import { RefreshTokenModel } from '~/models/refresh-token.model'
import { UserModel, UserType } from '~/models/user.model'
import { SignUpRequestBody } from '~/requests/auth.request'
import hasspassword from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { handleEmail } from '~/utils/other'

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

  private async signRefreshToken({
    user_id,
    verify,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    exp?: number
  }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenTypes.RefreshToken,
          verify,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
        options: {
          algorithm: 'HS256'
        }
      })
    }
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

  private async signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenTypes.ForgotPasswordToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as any,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as any
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
    const user = await UserModel.insertOne({
      ...payload,
      _id: user_id,
      username: `@${payload.username}`,
      password: hasspassword(payload.password),
      name: handleEmail(payload.email),
      verify: UserVerifyStatus.Unverifyed,
      email_verify_token: email_verify_token
    })
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id: user._id.toString(),
      verify: UserVerifyStatus.Unverifyed
    })
    const decoded_refresh_token = await verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
    RefreshTokenModel.insertOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      token: refresh_token,
      iat: new Date(decoded_refresh_token.iat * 1000),
      exp: new Date(decoded_refresh_token.exp * 1000)
    })
    return {
      access_token,
      refresh_token,
      user
    }
  }

  async signIn({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({ user_id, verify })
    const decoded_refresh_token = await verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
    const [user_res] = await Promise.all([
      UserModel.findById({
        _id: new mongoose.Types.ObjectId(user_id)
      }),
      RefreshTokenModel.insertOne({
        user_id: new mongoose.Types.ObjectId(user_id),
        token: refresh_token,
        iat: new Date(decoded_refresh_token.iat * 1000),
        exp: new Date(decoded_refresh_token.exp * 1000)
      })
    ])
    return {
      access_token,
      refresh_token,
      user_res: user_res!
    }
  }

  async logout(refresh_token: string) {
    await RefreshTokenModel.deleteOne({ token: refresh_token })
    return { message: AUTH_MESSAGE.LOGOUT_SUCCESSFULLY }
  }

  async refreshToken({
    user_id,
    verify,
    refresh_token,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    refresh_token: string
    exp: number
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify, exp }),
      RefreshTokenModel.deleteOne({ token: refresh_token })
    ])
    const decoded_refresh_token = await verifyToken({
      token: new_refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
    await RefreshTokenModel.insertOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      token: new_refresh_token,
      iat: new Date(decoded_refresh_token.iat * 1000),
      exp: new Date(decoded_refresh_token.exp * 1000)
    })
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async verifyEmail(user_id: string) {
    const user_res = await UserModel.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(user_id) },
      {
        email_verify_token: '',
        verify: UserVerifyStatus.Verifyed
      },
      {
        new: true
      }
    )
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id,
      verify: UserVerifyStatus.Verifyed
    })
    return {
      access_token,
      refresh_token,
      user_res: user_res!
    }
  }

  async forgotPassword(user: UserType) {
    const forgot_password_token = await this.signForgotPasswordToken({
      user_id: user._id.toString(),
      verify: user.verify
    })
    await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_token: forgot_password_token
    })
    console.log('forgot_password_token', forgot_password_token)
    return {
      message: AUTH_MESSAGE.FORGOT_PASSWORD_SUCCESSFULLY
    }
  }

  async resetPassword({ user_id, password }: { user_id: string; password: string }) {
    const result = await UserModel.findByIdAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(user_id)
      },
      {
        password: hasspassword(password),
        forgot_password_token: ''
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      message: AUTH_MESSAGE.RESET_PASSWORD_SUCCESSFULLY
    }
  }

  async changePassword({ user_id, new_password }: { user_id: string; new_password: string }) {
    const result = await UserModel.findByIdAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(user_id)
      },
      {
        password: hasspassword(new_password)
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      message: AUTH_MESSAGE.CHANGE_PASSWORD_SUCCESSFULLY
    }
  }
}

const authService = new AuthService()
export default authService
