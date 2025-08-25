import mongoose from 'mongoose'
import { BookmarkModel } from '~/models/bookmark.model'

class BookmarkService {
  async bookmark({ post_id, user_id }: { post_id: string; user_id: string }) {
    const result = await BookmarkModel.findOneAndUpdate(
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

  async unBookmark({ post_id, user_id }: { post_id: string; user_id: string }) {
    const result = await BookmarkModel.findOneAndDelete({
      user_id: new mongoose.Types.ObjectId(user_id),
      post_id: new mongoose.Types.ObjectId(post_id)
    })
    return result
  }
}

const bookmarkService = new BookmarkService()
export default bookmarkService
