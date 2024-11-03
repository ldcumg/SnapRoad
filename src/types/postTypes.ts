export type PostImage = {
  id: string;
  post_id: string;
  post_image_name: string;
  post_image_url: string;
};

export type PostCoverImage = PostImage & {
  post_lat: number;
  post_lng: number;
};

export interface ImageUpload {
  post_image_name?: string;
  created_at?: string;
  deleted_at?: string | null;
  group_id?: string | null;
  id: number;
  is_cover?: boolean;
  origin_created_at?: string;
  post_id?: string | null;
  post_image_url?: string;
  post_lat?: string | null;
  post_lng?: string | null;
  updated_at?: string;
  upload_session_id?: string;
  user_id?: string;
  blobUrl?: string; // 미리보기 URL
}

export interface Posts {
  created_at: string;
  deleted_at: string | null;
  group_id: string | null;
  image_array: Json | null;
  post_address: string;
  post_date: string;
  post_desc: string;
  post_id: string;
  post_lat: string;
  post_lng: string;
  post_thumbnail_image: string;
  post_time: string;
  updated_at: string | null;
  user_id: string | null;
}

export interface Images extends Required<UserGroup> {
  group_id: string; // 필수 필드로 group_id 추가
}

export interface ImagesWithBlobUrl extends ImageUpload {
  blobUrl?: string;
}
