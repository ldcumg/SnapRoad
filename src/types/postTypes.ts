export type PostImage = {
  id: number;
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
  created_at?: string | null;
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
  blobUrl?: string;
}
