'use server';

import { createClient } from '@/utils/supabase/server';

export const getPostDetail = async (groupId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('post')
    .select(
      `
    *,
    comments (*),
    tags (*),
    images (*)
  `,
    )
    .eq('group_id', groupId);

  if (error) throw new Error(error.message);
  return { message: '성공', data: data };
};
