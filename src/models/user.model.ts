import { UserVerifyStatus } from '~/constants/enums'
import mongoose, { ObjectId } from 'mongoose'

export interface UserType {
  _id: ObjectId
  email: string
  password: string
  username: string
  country: string
  name: string
  email_verify_token: string
  forgot_password_token: string
  verify: number
  location: string
  date_of_birth: Date
  bio: string
  website: string
  avatar: string
  cover_photo: string
  createdAt: Date
  updatedAt: Date
}

const UserShema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      min: [6, 'Password must be at least 6 characters'],
      max: [180, 'Password must be at most 180 characters'],
      index: true
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'Username must be unique'],
      trim: true,
      min: [3, 'Username must be at least 3 characters'],
      max: [50, 'Username must be at most 50 characters']
    },
    name: {
      type: String,
      trim: true,
      min: [3, 'Name must be at least 3 characters'],
      max: [50, 'Name must be at most 50 characters']
    },
    country: {
      type: String,
      trim: true,
      min: [2, 'Country must be at least 2 characters'],
      max: [50, 'Country must be at most 50 characters']
    },
    email_verify_token: {
      type: String,
      trim: true
    },
    forgot_password_token: {
      type: String,
      trim: true
    },
    verify: {
      type: Number,
      enum: [UserVerifyStatus.Unverifyed, UserVerifyStatus.Verifyed, UserVerifyStatus.Banned],
      default: UserVerifyStatus.Unverifyed
    },
    location: {
      type: String,
      trim: true,
      min: [2, 'Location must be at least 2 characters'],
      max: [50, 'Location must be at most 50 characters']
    },
    date_of_birth: {
      type: Date,
      trim: true
    },
    bio: {
      type: String,
      trim: true,
      min: [2, 'Bio must be at least 2 characters'],
      max: [50, 'Bio must be at most 50 characters']
    },
    website: {
      type: String,
      trim: true,
      min: [2, 'Website must be at least 2 characters'],
      max: [50, 'Website must be at most 50 characters']
    },
    avatar: {
      type: String,
      trim: true
    },
    cover_photo: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

export const UserModel = mongoose.model<UserType>('User', UserShema)
