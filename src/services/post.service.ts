import mongoose from 'mongoose'
import { PostTypes } from '~/constants/enums'
import { PostModel, PostType } from '~/models/post.model'
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

  async getPosts({ limit, page, user_id }: { limit: number; page: number; user_id: string }) {
    const posts = await PostModel.aggregate<PostType>([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'users'
        }
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'post_id',
          as: 'likes'
        }
      },
      {
        $match: {
          'likes.user_id': {
            $ne: new mongoose.Types.ObjectId(user_id)
          }
        }
      },
      {
        $match: {
          parent_id: {
            $eq: null
          }
        }
      },
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post_id',
          as: 'comments'
        }
      },
      {
        $lookup: {
          from: 'bookmarks',
          localField: '_id',
          foreignField: 'post_id',
          as: 'bookmarks'
        }
      },
      {
        $match: {
          'bookmarks.user_id': {
            $ne: new mongoose.Types.ObjectId(user_id)
          }
        }
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'parent_id',
          as: 'post_children'
        }
      },
      {
        $addFields: {
          like_count: {
            $size: '$likes'
          },
          comment_count: {
            $size: '$comments'
          },
          bookmark_count: {
            $size: '$bookmarks'
          },
          repost_count: {
            $size: '$post_children'
          }
        }
      },
      {
        $project: {
          likes: 0,
          post_children: 0,
          bookmarks: 0,
          comments: 0,
          'users.password': 0,
          'users.email': 0,
          'users.users.email': 0,
          'users.email_verify_token': 0,
          'users.country': 0,
          'users.createdAt': 0,
          'users.updatedAt': 0,
          'users.__v': 0,
          user_id: 0,
          parent_id: 0,
          type: 0
        }
      },
      {
        $unwind: {
          path: '$users'
        }
      }
    ])
    const post_ids = posts.map((post) => post._id)
    // Đã cập nhật trong DB nhưng chưa cập nhật lại trong mảng posts
    await PostModel.updateMany(
      {
        _id: {
          $in: post_ids
        }
      },
      {
        $inc: {
          views: 1
        }
      }
    )
    // Cập nhật lại trong mảng posts để trả về cho client thông số chính xác
    posts.map((post) => (post.views += 1))
    const total = await PostModel.countDocuments()
    const total_page = Math.ceil(total / limit)
    return {
      posts,
      total_page
    }
  }
}

const postService = new PostService()
export default postService
