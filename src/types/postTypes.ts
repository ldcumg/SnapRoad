import type { createPostPositioningStore } from "@/stores/post/postPositioningStore";

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

export interface PostData {
  user_id: string;
  group_id: string;
  post_desc: string;
  post_date: string;
  post_time: string;
  post_lat: number | null;
  post_lng: number | null;
  post_thumbnail_image: string;
  image_array: string[];
  post_address: string;
}

export interface UpdateImagePostIdParams {
  postId: string;
  uploadSessionId: string;
}

export interface TagData {
  tag_title: string;
  post_id: string;
  group_id: string;
}

export type PostPositioningState = {
  positioning: boolean;
  imageName: string;
  imageUrl: string;
  content: string;
  tag: string;
};

export type PostPositioningActions = {
  selectPosition: () => void;
};

export type PostPositioningStore = PostPositioningState & PostPositioningActions;

export type PostPositioningStoreApi = ReturnType<typeof createPostPositioningStore>;
