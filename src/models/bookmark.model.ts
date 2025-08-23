import mongoose, { Mongoose, ObjectId } from 'mongoose'

interface BookmarkType {
  _id: ObjectId
  user_id: ObjectId
  post_id: ObjectId
  createdAt: Date
  updatedAt: Date
}

const BookmarkSchema = new mongoose.Schema(
  {
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

export const BookmarkModel = mongoose.model<BookmarkType>('Bookmark', BookmarkSchema)
