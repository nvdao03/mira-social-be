import mongoose, { ObjectId, Schema } from 'mongoose'
import { MediaTypes, PostTypes } from '~/constants/enums'
import { Media } from '~/constants/other'
import { handleEnumToArray } from '~/utils/other'

const postType = handleEnumToArray(PostTypes)
const mediaType = handleEnumToArray(MediaTypes)

interface PostType {
  _id: ObjectId
  type: PostType
  parent_id: ObjectId | null
  content: string | null
  medias: Media[] | []
  user_id: ObjectId
  views: number
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema(
  {
    type: {
      type: Number,
      enum: postType,
      required: [true, 'Post type is required'],
      default: PostTypes.Post,
      index: true
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: 'posts',
      default: null
    },
    content: {
      type: String,
      default: null
    },
    media: {
      type: [
        {
          url: {
            type: String,
            required: [true, 'Media url is required']
          },
          type: {
            type: Number,
            enum: mediaType,
            required: [true, 'Media type is required']
          }
        }
      ],
      default: []
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'User id is required'],
      index: true
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export const PostModel = mongoose.model<PostType>('Post', PostSchema)
