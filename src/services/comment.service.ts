import mongoose from 'mongoose'
import { CommentModel } from '~/models/comment.model'
import { PostModel, PostType } from '~/models/post.model'

class CommentService {
  async comment({ content, user_id, post_id }: { content: string; user_id: string; post_id: string }) {
    const comment = await CommentModel.insertOne({
      content,
      user_id: new mongoose.Types.ObjectId(user_id),
      post_id: new mongoose.Types.ObjectId(post_id)
    })
    return comment
  }

  async getComments({ post_id, limit, page }: { post_id: string; limit: number; page: number }) {
    const commentList = await PostModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(post_id)
        }
      },
      {
        $lookup: {
          from: 'comments',
          let: {
            postId: '$_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$post_id', '$$postId']
                }
              }
            },
            {
              $sort: {
                created_at: -1
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
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
              }
            },
            {
              $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                _id: 1,
                content: 1,
                created_at: 1,
                user: {
                  _id: 1,
                  name: 1,
                  username: 1,
                  email: 1,
                  avatar: 1
                }
              }
            }
          ],
          as: 'comments'
        }
      },
      {
        $project: {
          _id: 0,
          comments: 1
        }
      }
    ])
    const comments = commentList[0]?.comments
    const total = await CommentModel.countDocuments({ post_id: new mongoose.Types.ObjectId(post_id) })
    const total_page = Math.ceil(total / limit)
    return {
      comments,
      total_page
    }
  }
}

const commentService = new CommentService()
export default commentService
