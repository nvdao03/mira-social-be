import mongoose from 'mongoose'
import { BookmarkModel } from '~/models/bookmark.model'
import { PostModel, PostType } from '~/models/post.model'

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

  async getBookmarks({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
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
        $lookup: {
          from: 'bookmarks',
          localField: '_id',
          foreignField: 'post_id',
          as: 'bookmarks'
        }
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
        $match: {
          'bookmarks.user_id': {
            $eq: new mongoose.Types.ObjectId(user_id)
          }
        }
      },
      {
        $addFields: {
          isLiked: {
            $in: [new mongoose.Types.ObjectId(user_id), '$likes.user_id']
          },
          isBookmarked: {
            $in: [new mongoose.Types.ObjectId(user_id), '$bookmarks.user_id']
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
    const post_ids = posts.map((post) => post._id.toString())
    const [, total] = await Promise.all([
      PostModel.updateMany(
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
      ),
      BookmarkModel.countDocuments()
    ])
    posts.map((post) => (post.views += 1))
    const total_page = Math.ceil(total / limit)
    return {
      posts,
      total_page
    }
  }
}

const bookmarkService = new BookmarkService()
export default bookmarkService
