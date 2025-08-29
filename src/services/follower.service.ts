import mongoose from 'mongoose'
import { FollowerModel } from '~/models/follower.model'
import { UserModel } from '~/models/user.model'

class FollowerService {
  async follow({ user_id, followed_user_id }: { user_id: string; followed_user_id: string }) {
    const follower = await FollowerModel.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(user_id),
        followed_user_id: new mongoose.Types.ObjectId(followed_user_id)
      },
      {
        $setOnInsert: {
          user_id: new mongoose.Types.ObjectId(user_id),
          followed_user_id: new mongoose.Types.ObjectId(followed_user_id)
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return follower
  }

  async unfollow({ user_id, followed_user_id }: { user_id: string; followed_user_id: string }) {
    const follower = await FollowerModel.deleteOne({
      user_id: new mongoose.Types.ObjectId(user_id),
      followed_user_id: new mongoose.Types.ObjectId(followed_user_id)
    })
    return follower
  }

  async getFollower({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
    const followers = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user_id)
        }
      },
      {
        $lookup: {
          from: 'followers',
          localField: '_id',
          foreignField: 'followed_user_id',
          as: 'users'
        }
      },
      {
        $project: {
          users: 1,
          _id: 0
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'users.user_id',
          foreignField: '_id',
          as: 'user_followers'
        }
      },
      {
        $project: {
          'user_followers._id': 1,
          'user_followers.name': 1,
          'user_followers.username': 1,
          'user_followers.avatar': 1
        }
      },
      {
        $unwind: {
          path: '$user_followers'
        }
      },
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      }
    ])
    const total = await FollowerModel.countDocuments({ followed_user_id: new mongoose.Types.ObjectId(user_id) })
    const total_page = Math.ceil(total / limit)
    return {
      followers,
      total_page
    }
  }

  async getFollowings({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
    const following = await UserModel.aggregate([
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
          as: 'users'
        }
      },
      {
        $project: {
          users: 1,
          _id: 0
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'users.followed_user_id',
          foreignField: '_id',
          as: 'user_followings'
        }
      },
      {
        $project: {
          'user_followings._id': 1,
          'user_followings.name': 1,
          'user_followings.username': 1,
          'user_followings.avatar': 1
        }
      },
      {
        $unwind: {
          path: '$user_followings'
        }
      },
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      }
    ])
    const total = await FollowerModel.countDocuments({ user_id: new mongoose.Types.ObjectId(user_id) })
    const total_page = Math.ceil(total / limit)
    return {
      following,
      total_page
    }
  }
}

const followerService = new FollowerService()
export default followerService
