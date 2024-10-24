'use server';

import { createClient } from '@/utils/supabase/server';

export interface Group {
  group_id: string;
  group_title: string;
  group_desc: string;
  group_invite_code: string;
  group_status: string;
  created_at: string;
}

export const fetchGroups = async (): Promise<Group[]> => {
  const supabase = createClient();
  const { data, error, status } = await supabase.from('group').select('*');

  if (error && status !== 406) {
    // 406: 'no rows'
    throw new Error(`그룹 정보 요청 실패: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('그룹 정보가 없습니다.');
  }

  console.log('데이터:', data);

  // 직렬화 가능한 객체로 변환
  return JSON.parse(JSON.stringify(data)) as Group[];
};
