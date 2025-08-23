import mongoose from 'mongoose'

interface FollowerType {
  _id: string
  user_id: string
  followed_user_id: string
  createdAt: Date
  updatedAt: Date
}

const FollowerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    followed_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Followed User ID is required']
    }
  },
  {
    timestamps: true
  }
)

export const FollowerModel = mongoose.model<FollowerType>('Follower', FollowerSchema)
