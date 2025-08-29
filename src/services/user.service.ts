import mongoose from 'mongoose'
import { PostModel, PostType } from '~/models/post.model'
import { UserModel, UserType } from '~/models/user.model'

class UserService {
  async getUserNotFollowerSuggestions({ limit, page, user_id }: { user_id: string; limit: number; page: number }) {
    const users = await UserModel.aggregate<UserType>([
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
          as: 'follows'
        }
      },
      {
        $addFields: {
          followedIds: {
            $map: {
              input: '$follows',
              as: 'f',
              in: '$$f.followed_user_id'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          let: {
            myId: '$_id',
            followed: '$followedIds'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $ne: ['$_id', '$$myId']
                    },
                    {
                      $not: {
                        $in: ['$_id', '$$followed']
                      }
                    }
                  ]
                }
              }
            }
          ],
          as: 'unfollowed_users'
        }
      },
      {
        $project: {
          unfollowed_users: 1,
          _id: 0
        }
      },
      {
        $unwind: {
          path: '$unfollowed_users'
        }
      },
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      }
    ])
    const total = await UserModel.countDocuments()
    const total_page = Math.ceil(total / limit)
    return {
      users,
      total_page
    }
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
          as: 'follwings'
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
        $addFields: {
          following_count: {
            $size: '$follwings'
          },
          follower_count: {
            $size: '$followers'
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

  async getPostProfile({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
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
      { $unwind: '$users' },
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
          like_count: { $size: '$likes' },
          comment_count: { $size: '$comments' },
          bookmark_count: { $size: '$bookmarks' },
          repost_count: { $size: '$post_children' },
          isLiked: {
            $in: [new mongoose.Types.ObjectId(user_id), '$likes.user_id']
          },
          isBookmarked: {
            $in: [new mongoose.Types.ObjectId(user_id), '$bookmarks.user_id']
          }
        }
      },
      { $skip: limit * (page - 1) },
      { $limit: limit },
      {
        $project: {
          likes: 0,
          post_children: 0,
          bookmarks: 0,
          comments: 0,
          'users.password': 0,
          'users.email': 0,
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

  async getLikePostProfile({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
    const posts = await PostModel.aggregate<PostType>([
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
          'likes.user_id': new mongoose.Types.ObjectId(user_id)
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
      { $unwind: '$users' },
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
          like_count: { $size: '$likes' },
          comment_count: { $size: '$comments' },
          bookmark_count: { $size: '$bookmarks' },
          repost_count: { $size: '$post_children' },
          isLiked: {
            $in: [new mongoose.Types.ObjectId(user_id), '$likes.user_id']
          },
          isBookmarked: {
            $in: [new mongoose.Types.ObjectId(user_id), '$bookmarks.user_id']
          }
        }
      },
      { $skip: limit * (page - 1) },
      { $limit: limit },
      {
        $project: {
          likes: 0,
          post_children: 0,
          bookmarks: 0,
          comments: 0,
          'users.password': 0,
          'users.email': 0,
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
