import { Database, Tables } from '@/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export type SupabaseDatabase = SupabaseClient<Database>;
export type Comment = Tables<'comment'>;
export type Group = Tables<'group'>;
export type Images = Tables<'images'>;
export type Posts = Tables<'posts'>;
export type Profiles = Tables<'profiles'>;
export type Tags = Tables<'tags'>;
export type UserGroup = Tables<'user_group'>;

// Omit: CommentWithDeletedAt 타입 정의 (deleted_at 추가)
export interface CommentWithDeletedAt extends Omit<Comment, 'deleted_at'> {
  deleted_at: Comment['deleted_at'] | null;
}

// Omit 여러개: GroupWithoutTimestamps 타입 정의 (created_at, updated_at 제외)
export type GroupWithoutTimestamps = Omit<Group, 'created_at' | 'updated_at'>;

// Required: RequiredGroup 타입 정의 (모든 필드를 필수로 변경)
export type RequiredGroup = Required<Group>;

// Pick: PickedImages 타입 정의 (필요한 필드만 선택)
export type PickedImages = Pick<Images, 'id' | 'post_image_url'>;

// Partial: PartialPosts 타입 정의 (모든 필드를 선택적으로 변경)
export type PartialPosts = Partial<Posts>;

// extends: ImagesWithAdditionalField 타입 정의 (새로운 필드를 추가)
export interface ImagesWithAdditionalField extends Images {
  additional_field: string; // 추가된 필드
}

// 인터섹션: CombinedProfileAndPosts 타입 정의 (Profiles와 Posts를 합친 타입)
export type CombinedProfileAndPosts = Profiles & Posts; // 인터섹션 타입

// extends: TagsWithGroupId 타입 정의 (group_id 추가)
export interface TagsWithGroupId extends Tags {
  group_id?: string; // group_id를 선택적 필드로 추가
}

// Required: UserGroupWithRequiredFields 타입 정의 (모든 필드를 필수로 변경, group_id 추가)
export interface UserGroupWithRequiredFields extends Required<UserGroup> {
  group_id: string; // 필수 필드로 group_id 추가
}