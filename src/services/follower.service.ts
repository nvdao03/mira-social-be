import mongoose from 'mongoose'
import { FollowerModel } from '~/models/follower.model'

class FollowerService {
  async follow({ user_id, followed_user_id }: { user_id: string; followed_user_id: string }) {
    const follower = await FollowerModel.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(user_id),
        followed_user_id: new mongoose.Types.ObjectId(followed_user_id)
      },
      {
        $setOnInsert: {
          user_id: new mongoose.Types.ObjectId(user_id),
          followed_user_id: new mongoose.Types.ObjectId(followed_user_id)
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return follower
  }

  async unfollow({ user_id, followed_user_id }: { user_id: string; followed_user_id: string }) {
    const follower = await FollowerModel.deleteOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      followed_user_id: new mongoose.Types.ObjectId(followed_user_id)
    })
    return follower
  }
}

const followerService = new FollowerService()
export default followerService
