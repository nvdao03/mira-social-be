import { UserModel } from '~/models/user.model'

class SearchService {
  async search({ key, limit, page }: { key: string; limit: number; page: number }) {
    if (!key || key.trim() === '') {
      return { data: [], total_page: 0 }
    }
    const condition = {
      $or: [{ name: { $regex: key, $options: 'i' } }, { username: { $regex: key, $options: 'i' } }]
    }
    const [data, total] = await Promise.all([
      UserModel.aggregate([
        {
          $match: {
            $or: [
              {
                name: {
                  $regex: key,
                  $options: 'i'
                }
              },
              {
                username: {
                  $regex: key,
                  $options: 'i'
                }
              }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            avatar: 1,
            name: 1,
            username: 1,
            verify: 1
          }
        },
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ]),
      UserModel.countDocuments(condition)
    ])
    const total_page = Math.ceil(total / limit)
    return { data, total_page }
  }
}

const searchService = new SearchService()
export default searchService
