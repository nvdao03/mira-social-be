import mongoose from 'mongoose'

export const RefreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      trim: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

export const RefreshTokenModel = mongoose.model('RefreshToken', RefreshTokenSchema, 'refresh_tokens')
