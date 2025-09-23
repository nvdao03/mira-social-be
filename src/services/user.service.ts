import mongoose from 'mongoose'
import { PostModel, PostType } from '~/models/post.model'
import { UserModel, UserType } from '~/models/user.model'
import { UpdateProfileRequestBody } from '~/requests/user.request'

class UserService {
  async getUserNotFollowerSuggestions({ limit, page, user_id }: { user_id: string; limit: number; page: number }) {
    const users = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(user_id) } },

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
        $addFields: {
          followedIds: { $concatArrays: ['$followedIds', ['$_id']] }
        }
      },
      {
        $lookup: {
          from: 'users',
          let: { followed: '$followedIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $not: { $in: ['$_id', '$$followed'] }
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
      { $unwind: '$unfollowed_users' },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: limit * (page - 1) }, { $limit: limit }]
        }
      },
      { $unwind: '$metadata' },
      {
        $addFields: {
          total_page: {
            $ceil: { $divide: ['$metadata.total', limit] }
          }
        }
      }
    ])
    return {
      users: users[0]?.data || [],
      total_page: users[0]?.total_page || 0
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

  async getPostProfile({
    user_id,
    limit,
    page,
    user_id_login
  }: {
    user_id: string
    limit: number
    page: number
    user_id_login: string
  }) {
    const posts = await PostModel.aggregate<PostType>([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user_id) // lọc theo chủ post
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
            $in: [new mongoose.Types.ObjectId(user_id_login), '$likes.user_id'] // Lọc theo user đang login để hiển thị isLiked
          },
          isBookmarked: {
            $in: [new mongoose.Types.ObjectId(user_id_login), '$bookmarks.user_id'] // Lọc theo user đang login để hiển thị isBookmared
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

  async getLikePostProfile({
    user_id,
    limit,
    page,
    user_id_login
  }: {
    user_id: string
    limit: number
    page: number
    user_id_login: string
  }) {
    const userObjectId = new mongoose.Types.ObjectId(user_id)
    const loginObjectId = new mongoose.Types.ObjectId(user_id_login)

    const result = await PostModel.aggregate([
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'post_id',
          as: 'likes'
        }
      },
      // Lọc post mà user đã like
      { $match: { 'likes.user_id': userObjectId } },
      // Gom dữ liệu
      {
        $facet: {
          posts: [
            {
              $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'users'
              }
            },
            { $unwind: '$users' },
            { $lookup: { from: 'comments', localField: '_id', foreignField: 'post_id', as: 'comments' } },
            { $lookup: { from: 'bookmarks', localField: '_id', foreignField: 'post_id', as: 'bookmarks' } },
            { $lookup: { from: 'posts', localField: '_id', foreignField: 'parent_id', as: 'post_children' } },
            {
              $addFields: {
                like_count: { $size: '$likes' },
                comment_count: { $size: '$comments' },
                bookmark_count: { $size: '$bookmarks' },
                repost_count: { $size: '$post_children' },
                isLiked: {
                  $in: [loginObjectId, { $map: { input: '$likes', as: 'l', in: '$$l.user_id' } }]
                },
                isBookmarked: {
                  $in: [loginObjectId, { $map: { input: '$bookmarks', as: 'b', in: '$$b.user_id' } }]
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
                parent_id: 0,
                type: 0
              }
            }
          ],
          total: [{ $count: 'count' }]
        }
      }
    ])

    const posts = result[0]?.posts || []
    const totalCount = result[0]?.total[0]?.count || 0
    const total_page = Math.ceil(totalCount / limit)

    return { posts, total_page }
  }

  async updateProfile({ user_id, body }: { user_id: string; body: UpdateProfileRequestBody }) {
    const updateData = body.date_of_birth ? { ...body, date_of_birth: new Date(body.date_of_birth) } : body
    const user = await UserModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(user_id)
      },
      {
        $set: {
          ...(updateData as UpdateProfileRequestBody & { date_of_birth: Date })
        },
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return user
  }
}

const userService = new UserService()
export default userService
