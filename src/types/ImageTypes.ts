export interface ImageData {
  post_image_name: string;
  post_image_url: string;
  created_at: string;
  is_cover: boolean;
  post_lat: number;
  post_lng: number;
  origin_created_at: string;
  user_id: string | undefined;
  upload_session_id: string;
}
