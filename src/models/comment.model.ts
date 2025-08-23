import mongoose, { ObjectId } from 'mongoose'

interface CommentTypes {
  _id: ObjectId
  content: string
  user_id: ObjectId
  post_id: ObjectId
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [500, 'Content must be at most 500 characters']
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post ID is required']
    }
  },
  {
    timestamps: true
  }
)

export const CommentModel = mongoose.model<CommentTypes>('Comment', CommentSchema)
