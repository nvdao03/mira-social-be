export interface SignUpRequestBody {
  email: string
  password: string
  username: string
  country: string
}

export interface SignInRequestBody {
  email: string
  password: string
}
