import { UserModel } from '~/models/user.model'

class AuthService {
  async checkEmailExits(email: string) {
    const user = await UserModel.findOne({ email })
    return Boolean(user)
  }
}

const authService = new AuthService()
export default authService
