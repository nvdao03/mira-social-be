import { PostTypes } from '~/constants/enums'
import { Media } from '~/constants/other'

export interface CreatePostRequest {
  type: PostTypes
  parent_id?: string | null
  content?: string | null
  medias: Media[] | []
}
