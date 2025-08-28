import mongoose from 'mongoose'
import { PostModel, PostType } from '~/models/post.model'
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

  async getProfile(user_id: string) {
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user_id)
        }
      },
      {
        $lookup: {
          from: 'followers',
          localField: '_id',
          foreignField: 'user_id',
          as: 'following'
        }
      },
      {
        $lookup: {
          from: 'followers',
          localField: '_id',
          foreignField: 'followed_user_id',
          as: 'follower'
        }
      },
      {
        $addFields: {
          following_count: {
            $size: '$following'
          },
          follower_count: {
            $size: '$follower'
          }
        }
      },
      {
        $project: {
          follower: 0,
          following: 0,
          password: 0,
          email_verify_token: 0
        }
      }
    ])
    return user
  }

  async getProfileUserName({ username }: { username: string }) {
    const user = await UserModel.aggregate([
      {
        $match: {
          username: username
        }
      },
      {
        $lookup: {
          from: 'followers',
          localField: '_id',
          foreignField: 'user_id',
          as: 'following'
        }
      },
      {
        $lookup: {
          from: 'followers',
          localField: '_id',
          foreignField: 'followed_user_id',
          as: 'follower'
        }
      },
      {
        $addFields: {
          following_count: {
            $size: '$following'
          },
          follower_count: {
            $size: '$follower'
          }
        }
      },
      {
        $project: {
          follower: 0,
          following: 0,
          password: 0,
          email_verify_token: 0
        }
      }
    ])
    return user
  }

  async getUserPosts({
    user_id,
    limit,
    page,
    username
  }: {
    user_id: string
    username: string
    limit: number
    page: number
  }) {
    const posts = await PostModel.aggregate<PostType>([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user_id)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'users'
        }
      },
      {
        $unwind: {
          path: '$users'
        }
      },
      {
        $match: {
          'users.username': username
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
          },
          isLiked: {
            $in: [new mongoose.Types.ObjectId(user_id), '$likes.user_id']
          },
          isBookmarkd: {
            $in: [new mongoose.Types.ObjectId(user_id), '$bookmarks.user_id']
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
      }
    ])
    const total = await PostModel.countDocuments()
    const total_page = Math.ceil(total / limit)
    return {
      posts,
      total_page
    }
  }

  async getUserLikePosts({
    user_id,
    limit,
    page,
    username
  }: {
    user_id: string
    username: string
    limit: number
    page: number
  }) {
    const posts = await PostModel.aggregate<PostType>([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user_id)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'users'
        }
      },
      {
        $unwind: {
          path: '$users'
        }
      },
      {
        $match: {
          'users.username': username
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
          $expr: {
            $in: ['$users._id', '$likes.user_id']
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
          },
          isLiked: {
            $in: [new mongoose.Types.ObjectId(user_id), '$likes.user_id']
          },
          isBookmarkd: {
            $in: [new mongoose.Types.ObjectId(user_id), '$bookmarks.user_id']
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
      }
    ])
    const total = await PostModel.countDocuments()
    const total_page = Math.ceil(total / limit)
    return {
      posts,
      total_page
    }
  }
}

const userService = new UserService()
export default userService
