import { Json } from './supabaseTypes';

export type PostDetail = {
  post_id: string;
  group_id: string | null;
  user_id: string | null;
  post_desc: string;
  post_address: string;
  post_thumbnail_image: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  post_date: string;
  post_time: string;
  image_array: string[] | null | Json;
  post_lng: number | null;
  post_lat: number | null;
  tags: TagDetail[];
  images: ImageDetail[];
  group: GroupDetail;
  post_author_user: PostAuthorUserDetail;
};

export type TagDetail = {
  id: string;
  post_id: string;
  group_id: string;
  tag_title: string;
};

export type ImageDetail = {
  id: number;
  post_id: string;
  user_id: string;
  group_id: string;
  is_cover: boolean;
  post_lat: number | null;
  post_lng: number | null;
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
  post_image_url: string;
  post_image_name: string;
  origin_created_at: string;
  upload_session_id: string;
  signed_image_url: string | null;
};

export type GroupDetail = {
  group_title: string;
};

export type PostAuthorUserDetail = {
  user_id: string;
  user_nickname: string;
  user_image_url: string;
  signed_image_url: string | null;
};

export type UserDetail = {
  profiles: Profile;
  profileImageUrl: string | null;
};

export type Profile = {
  user_id: string;
  user_email: string | null;
  user_nickname: string | null;
  user_image_url: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

export type Comment = {
  comment_desc: string | null;
  comment_id: string;
  created_at: string;
  deleted_at: string | null;
  parent_id: string | null;
  post_id: string | null;
  updated_at: string | null;
  user_id: string | null;
  comment_author_user: {
    signed_image_url: string | null;
    user_nickname: string | null | undefined;
  };
  children?: Comment[];
};

// export type CommentMap = { [key: string]: Comment & { children: Comment[] } };
export type CommentMap = { [key: string]: CommentTree };

// 재귀 트리 구조
export type CommentTree = Comment & { children: CommentTree[] };

export type CommentAuthorUser = {
  user_nickname: string;
  signed_image_url: string;
};
