import { Database, Tables } from '@/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export type SupabaseDatabase = SupabaseClient<Database>;
export type Images = Tables<'images'>;
export type Posts = Tables<'posts'>;
export type Profiles = Tables<'profiles'>;
export type User_group = Tables<'user_group'>;

// Omit - 특정 타입에서 특정 속성을 제외하여 새로운 타입을 만드는 유틸리티 타입
export interface ImagesWithDeletedAt extends Omit<Images, 'deleted_at'> {
  deleted_at: Images | null;
}
