import mongoose from 'mongoose'
import { UserModel } from '~/models/user.model'

class UserService {
  async getUserSuggestions(user_id: string) {
    const userFollowerSuggestions = await UserModel.aggregate([
      {
        $match: {
          _id: {
            $ne: new mongoose.Types.ObjectId(user_id)
          }
        }
      },
      {
        $lookup: {
          from: 'followers',
          localField: '_id',
          foreignField: 'followed_user_id',
          as: 'followers'
        }
      },
      {
        $match: {
          'followers.user_id': {
            $ne: new mongoose.Types.ObjectId(user_id)
          }
        }
      },
      {
        $project: {
          email_verify_token: 0,
          followers: 0,
          password: 0,
          country: 0
        }
      }
    ])
    return userFollowerSuggestions
  }
}

const userService = new UserService()
export default userService
