import mongoose from 'mongoose'
import { LikeModel } from '~/models/like.model'

class LikeService {
  async like({ post_id, user_id }: { post_id: string; user_id: string }) {
    const result = await LikeModel.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(user_id),
        post_id: new mongoose.Types.ObjectId(post_id)
      },
      {
        $setOnInsert: {
          user_id: new mongoose.Types.ObjectId(user_id),
          post_id: new mongoose.Types.ObjectId(post_id)
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return result
  }

  async unlike({ post_id, user_id }: { post_id: string; user_id: string }) {
    const result = await LikeModel.findOneAndDelete({
      user_id: new mongoose.Types.ObjectId(user_id),
      post_id: new mongoose.Types.ObjectId(post_id)
    })
    return result
  }
}

const likeService = new LikeService()
export default likeService
