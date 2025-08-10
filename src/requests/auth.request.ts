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

export interface LogoutRequest {
  access_token: string
  refresh_token: string
}

export interface RefreshTokenRequestBody {
  refresh_token: string
}

export interface TokenPayload {
  user_id: string
  token_type: string
  verify: number
  iat: number
  exp: number
}
