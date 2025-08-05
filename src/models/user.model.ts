import { USER_VERIFY_STATUS } from '~/constants/enums'
import { ObjectId } from './../../node_modules/bson/src/objectid'
import mongoose from 'mongoose'

const UserShema = new mongoose.Schema(
  {
    _id: {
      type: ObjectId,
      unique: true,
      required: [true, 'Id is required'],
      default: () => new ObjectId()
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
      trim: true,
      indexedDB: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      min: [6, 'Password must be at least 6 characters'],
      max: [180, 'Password must be at most 180 characters'],
      indexedDB: true
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'Username must be unique'],
      trim: true,
      min: [3, 'Username must be at least 3 characters'],
      max: [50, 'Username must be at most 50 characters'],
      indexedDB: true
    },
    name: {
      type: String,
      unique: [true, 'Name must be unique'],
      trim: true,
      min: [3, 'Name must be at least 3 characters'],
      max: [50, 'Name must be at most 50 characters'],
      default: ''
    },
    country: {
      type: String,
      trim: true,
      min: [2, 'Country must be at least 2 characters'],
      max: [50, 'Country must be at most 50 characters']
    },
    email_verify_token: {
      type: String,
      trim: true,
      default: ''
    },
    forgot_password_token: {
      type: String,
      trim: true,
      default: ''
    },
    reset_password_token: {
      type: String,
      trim: true,
      default: ''
    },
    verify: {
      type: Number,
      enum: [USER_VERIFY_STATUS.Unverified, USER_VERIFY_STATUS.Verified, USER_VERIFY_STATUS.Banned],
      default: USER_VERIFY_STATUS.Unverified
    },
    location: {
      type: String,
      trim: true,
      min: [2, 'Location must be at least 2 characters'],
      max: [50, 'Location must be at most 50 characters'],
      default: ''
    },
    date_of_birth: {
      type: Date,
      trim: true
    },
    bio: {
      type: String,
      trim: true,
      min: [2, 'Bio must be at least 2 characters'],
      max: [50, 'Bio must be at most 50 characters'],
      default: ''
    },
    website: {
      type: String,
      trim: true,
      min: [2, 'Website must be at least 2 characters'],
      max: [50, 'Website must be at most 50 characters'],
      default: ''
    },
    avatar: {
      type: String,
      trim: true,
      default: ''
    },
    cover_photo: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

export const UserModel = mongoose.model('User', UserShema)
