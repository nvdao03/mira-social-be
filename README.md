# Mira Back-end

This is the back-end component of the **Mira** project. It is responsible for handling the server-side logic and API endpoints.

Live server: [mira.io.vn](mira.io.vn)

## 📑 Table of Contents

- [Mira Back-end](#mira-back-end)
  - [📑 Table of Contents](#-table-of-contents)
  - [🚀 Installation](#-installation)
  - [⚡ Usage](#-usage)
  - [🔑 API Endpoints](#-api-endpoints)
  - [📄 Document API](#-document-api)
  - [🗄️ Database Schema](#️-database-schema)
    - [1. Users](#1-users)
    - [2. Posts](#2-posts)
    - [3. Comments](#3-comments)
    - [4. Likes](#4-likes)
    - [5. Followers](#5-followers)
    - [6. Bookmarks](#6-bookmarks)
    - [7. Refresh Tokens](#7-refresh-tokens)
    - [👨‍💻 Author](#-author)

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nvdao03/mira-social-be.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a cluster in mongoDB

4. Create acount AWS

5. Create acount Google Console

6. Create `.env`

   ```bash
   PORT

   NODE_ENV

   DB_USERNAME
   DB_PASSWORD
   DB_NAME

   JWT_SECRET_ACCESS_TOKEN
   JWT_SECRET_REFRESH_TOKEN
   JWT_SECRET_EMAIL_VERIFY_TOKEN
   JWT_SECRET_FORGOT_PASSWORD_TOKEN

   PASSWORD_SECRET

   ACCESS_TOKEN_EXPIRES_IN
   FRESH_TOKEN_EXPIRES_IN
   FORGOT_PASSWORD_TOKEN_EXPIRES_IN
   EMAIL_VERIFY_TOKEN_EXPIRES_IN

   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   AWS_REGION
   AWS_SES_FROM_ADDRESS
   AWS_S3_BUGKET_NAME

   CLIENT_REDIRECT_URL_VERIFY_EMAIL
   CLIENT_REDIRECT_URL_VERIFY_FORGOT_PASSWORD

   GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET
   GOOGLE_REDIRECT_URI
   GOOGLE_CLIENT_REDIRECT_URL
   ```

## ⚡ Usage

To start the server, run the following command:

```bash
npm run dev
```

## 🔑 API Endpoints

- `/auth`: User authentication processing endpoint
- `/bookmarks`: Endpoint that allows users to save and manage bookmarked posts
- `/comments`: Endpoint to create, edit, delete and get list of comments on post
- `/follows`: Endpoint that manages follow/unfollow actions between users
- `/like`: Endpoint to manage the number of likes (like/unlike) for a post
- `/medias`: Endpoint to upload, delete and retrieve information of media files (photos, videos)
- `/posts`: Endpoint to create, edit, delete and get list of posts
- `/search`: Endpoint to search users by keyword.
- `/users`: User information management endpoint

## 📄 Document API

- [https://mira-social-be.onrender.com/api-doc/](`https://mira-social-be.onrender.com/api-doc/`)

## 🗄️ Database Schema

### 1. Users

| Field                     | Type   | Description                                                   |
| ------------------------- | ------ | ------------------------------------------------------------- |
| `email`                   | String | Email người dùng (unique, required).                          |
| `password`                | String | Mật khẩu đã hash (required).                                  |
| `username`                | String | Tên đăng nhập (unique, required).                             |
| `name`                    | String | Tên hiển thị.                                                 |
| `country`                 | String | Quốc gia.                                                     |
| `email_verify_token`      | String | Token để xác minh email.                                      |
| `forgot_password_token`   | String | Token để reset mật khẩu.                                      |
| `verify`                  | Number | Trạng thái tài khoản (0: Unverified, 1: Verified, 2: Banned). |
| `location`                | String | Địa chỉ/địa điểm người dùng.                                  |
| `date_of_birth`           | Date   | Ngày sinh.                                                    |
| `bio`                     | String | Tiểu sử ngắn.                                                 |
| `website`                 | String | Website cá nhân.                                              |
| `avatar`                  | String | Ảnh đại diện.                                                 |
| `cover_photo`             | String | Ảnh bìa.                                                      |
| `createdAt` / `updatedAt` | Date   | Tự động thêm bởi.                                             |

---

### 2. Posts

| Field                     | Type     | Description                                   |
| ------------------------- | -------- | --------------------------------------------- |
| `type`                    | Number   | Loại bài viết (postType enum).                |
| `parent_id`               | ObjectId | Tham chiếu bài viết cha (nếu là reply/share). |
| `content`                 | String   | Nội dung bài viết.                            |
| `medias`                  | Array    | Danh sách media (url + type).                 |
| `user_id`                 | ObjectId | Tham chiếu tới `User`.                        |
| `views`                   | Number   | Lượt xem (mặc định 0).                        |
| `createdAt` / `updatedAt` | Date     | Tự động thêm.                                 |

---

### 3. Comments

| Field                     | Type     | Description                   |
| ------------------------- | -------- | ----------------------------- |
| `content`                 | String   | Nội dung bình luận (max 500). |
| `user_id`                 | ObjectId | Tham chiếu tới `User`.        |
| `post_id`                 | ObjectId | Tham chiếu tới `Post`.        |
| `createdAt` / `updatedAt` | Date     | Tự động thêm.                 |

---

### 4. Likes

| Field                     | Type     | Description           |
| ------------------------- | -------- | --------------------- |
| `user_id`                 | ObjectId | Người đã like (User). |
| `post_id`                 | ObjectId | Bài viết được like.   |
| `createdAt` / `updatedAt` | Date     | Tự động thêm.         |

---

### 5. Followers

| Field                     | Type     | Description                |
| ------------------------- | -------- | -------------------------- |
| `user_id`                 | ObjectId | Người theo dõi (follower). |
| `followed_user_id`        | ObjectId | Người được theo dõi.       |
| `createdAt` / `updatedAt` | Date     | Tự động thêm.              |

---

### 6. Bookmarks

| Field                     | Type     | Description             |
| ------------------------- | -------- | ----------------------- |
| `user_id`                 | ObjectId | Người bookmark.         |
| `post_id`                 | ObjectId | Bài viết được bookmark. |
| `createdAt` / `updatedAt` | Date     | Tự động thêm.           |

---

### 7. Refresh Tokens

| Field                     | Type     | Description                     |
| ------------------------- | -------- | ------------------------------- |
| `token`                   | String   | Refresh token (JWT).            |
| `user_id`                 | ObjectId | Tham chiếu tới `User`.          |
| `iat`                     | Date     | Issued At (thời điểm tạo).      |
| `exp`                     | Date     | Expiration (thời điểm hết hạn). |
| `createdAt` / `updatedAt` | Date     | Tự động thêm.                   |

### 👨‍💻 Author

Developed by Nguyễn Văn Đạo 🚀
