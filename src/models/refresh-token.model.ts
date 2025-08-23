import mongoose from 'mongoose'

interface RefreshTokenType {
  token: string
  user_id: string
  iat: Date
  exp: Date
  createdAt: Date
  updatedAt: Date
}

export const RefreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      trim: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    iat: {
      type: Date
    },
    exp: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

export const RefreshTokenModel = mongoose.model<RefreshTokenType>('RefreshToken', RefreshTokenSchema, 'refresh_tokens')
