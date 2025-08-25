import mongoose from 'mongoose'
import { PostTypes } from '~/constants/enums'
import { PostModel } from '~/models/post.model'
import { CreatePostRequest } from '~/requests/post.request'

class PostService {
  async createPost({ user_id, body }: { user_id: string; body: CreatePostRequest }) {
    const post = await PostModel.insertOne({
      ...body,
      type: body.type || PostTypes.Post,
      user_id: new mongoose.Types.ObjectId(user_id),
      content: body.content || null,
      medias: body.medias || [],
      parent_id: body.parent_id || null
    })
    return post
  }
}

const postService = new PostService()
export default postService
