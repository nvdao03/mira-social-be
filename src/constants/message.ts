export const AUTH_MESSAGE = {
  VALIDATION_ERROR: 'Invalid data',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_NOT_FOUND: 'Email not found',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_LENGTH: 'Password must be at least 6 to 180 characters',
  USERNAME_REQUIRED: 'Username is required',
  USERNAME_LENGTH: 'Username must be at least 3 to 50 characters',
  COUNTRY_REQUIRED: 'Country/Region is required',
  ACCOUNT_NOT_FOUND: 'Account not found',
  ACCOUNT_CREATED_SUCCESSFULLY: 'Account created successfully',
  USER_NAME_ALREADY_EXISTS: 'Username already exists',
  USER_NAME_NOT_FOUND: 'Username not found',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
  SIGN_IN_SUCCESSFULLY: 'Sign in successfully',
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_NOT_FOUND: 'Access token not found',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',
  LOGOUT_SUCCESSFULLY: 'Logout successfully',
  REFRESH_TOKEN_SUCCESSFULLY: 'Refresh token successfully',
  EMAIL_VERIFY_TOKEN_REQUIRED: 'Email verify token is required',
  EMAIL_VERIFY_TOKEN_NOT_FOUND: 'Email verify token not found',
  EMAIL_VERIFIED_SUCCESSFULLY: 'Email verified successfully',
  EMAIL_VERIFIED_BEFORE: 'Email verified before',
  FORGOT_PASSWORD_SUCCESSFULLY: 'Forgot password successfully',
  EMAIL_INVALID: 'Email is invalid',
  FORGOT_PASSWORD_TOKEN_REQUIRED: 'Forgot password token is required',
  FORGOT_PASSWORD_TOKEN_INVALID: 'Forgot password token is invalid',
  FORGOT_PASSWORD_NOT_FOUND: 'Forgot password not found',
  VERIFY_FORGOT_PASSWORD_SUCCESSFULLY: 'Verify forgot password successfully',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_LENGTH: 'Confirm password must be at least 6 to 180 characters',
  PASSWORD_NOT_MATCH: 'Password not match',
  RESET_PASSWORD_SUCCESSFULLY: 'Reset password successfully',
  OLD_PASSWORD_REQUIRED: 'Old password is required',
  OLD_PASSWORD_LENGTH: 'Old password must be at least 6 to 180 characters',
  CONFIRM_PASSWORD_NOT_MATCH: 'Confirm password not match',
  OLD_PASSWORD_NOT_MATCH: 'Old password not match',
  CHANGE_PASSWORD_SUCCESSFULLY: 'Change password successfully',
  NEW_PASSWORD_LENGTH: 'New password must be at least 6 to 180 characters',
  NEW_PASSWORD_REQUIRED: 'New password is required',
  CURRENT_PASSWORD_NOT_MATCH: 'Current password not match'
}

export const USER_MESSAGE = {
  USER_NOT_VERIFY: 'User not verify',
  USER_NOT_FOUND: 'User not found',
  GET_USER_SUGGESTIONS_SUCCESSFULLY: 'Get user suggestions successfully',
  USERNAME_REQUIRED: 'Username is required',
  GET_PROFILE_SUCCESSFULLY: 'Get profile successfully',
  USERNAME_NOT_FOUND: 'Username not found',
  GET_USER_POSTS_SUCCESSFULLY: 'Get user posts successfully'
}

export const MEDIA_MESSAGE = {
  UPLOAD_IMAGE_SUCCESSFULLY: 'Upload image successfully',
  UPLOAD_VIDEO_SUCCESSFULLY: 'Upload video successfully'
}

export const POST_MESSAGE = {
  POST_NOT_FOUND: 'Post not found',
  CREATE_POST_SUCCESSFULLY: 'Create post successfully',
  DELETE_POST_SUCCESSFULLY: 'Delete post successfully',
  LIKE_POST_SUCCESSFULLY: 'Like post successfully',
  UNLIKE_POST_SUCCESSFULLY: 'Unlike post successfully',
  SAVE_POST_SUCCESSFULLY: 'Save post successfully',
  UNSAVE_POST_SUCCESSFULLY: 'Unsave post successfully',
  GET_POSTS_SUCCESSFULLY: 'Get posts successfully',
  POST_TYPE_INVALID: 'Post type is invalid',
  PARENT_ID_REQUIRED: 'Parent id is required for RePost',
  PARENT_ID_INVALID: 'Parent id must be null for Post',
  CONTENT_NOT_REQUIRED: 'Content must be null for RePost',
  PARENT_ID_NOT_REQUIRED: 'Parent id must be null',
  POST_ID_REQUIRED: 'Post id is required',
  POST_ID_INVALID: 'Post id is invalid',
  GET_POST_DETAIL_SUCCESSFULLY: 'Get post detail successfully'
}

export const LIKE_MESSAGE = {
  LIKE_POST_SUCCESSFULLY: 'Like post successfully',
  UNLIKE_POST_SUCCESSFULLY: 'Unlike post successfully',
  LIKE_NOT_FOUND: 'Like not found'
}

export const BOOKMARK_MESSAGE = {
  BOOKMARK_POST_SUCCESSFULLY: 'Bookmark post successfully',
  UNBOOKMARK_POST_SUCCESSFULLY: 'Unbookmark post successfully',
  BOOKMARK_NOT_FOUND: 'Bookmark not found',
  GET_BOOKMARKS_SUCCESSFULLY: 'Get bookmarks successfully'
}

export const COMMENT_MESSAGE = {
  CONTENT_REQUIRED: 'Content is required',
  COMMENT_POST_SUCCESSFULLY: 'Comment post successfully',
  COMMENT_NOT_FOUND: 'Comment not found',
  GET_COMMENTS_SUCCESSFULLY: 'Get comments successfully',
  DELETE_COMMENT_SUCCESSFULLY: 'Delete comment successfully'
}

export const FOLLOWER_MESSAGE = {
  FOLLOW_USER_SUCCESSFULLY: 'Follow user successfully',
  UNFOLLOW_USER_SUCCESSFULLY: 'Unfollow user successfully',
  FOLLOWER_NOT_FOUND: 'Follower not found',
  FOLLOWED_USER_ID_REQUIRED: 'Followed user id is required',
  FOLLOWED_USER_ID_INVALID: 'Followed user id is invalid',
  FOLLOWER_USER_ID_NOT_FOUND: 'Follower user id not found',
  GET_FOLLOWERS_SUCCESSFULLY: 'Get followers successfully',
  GET_FOLLOWINGS_SUCCESSFULLY: 'Get followings successfully'
}
