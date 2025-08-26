import mongoose from 'mongoose'
import { CommentModel } from '~/models/comment.model'

class CommentService {
  async comment({ content, user_id, post_id }: { content: string; user_id: string; post_id: string }) {
    const comment = await CommentModel.insertOne({
      content,
      user_id: new mongoose.Types.ObjectId(user_id),
      post_id: new mongoose.Types.ObjectId(post_id)
    })
    return comment
  }
}

const commentService = new CommentService()
export default commentService
