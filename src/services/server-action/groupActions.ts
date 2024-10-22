'use server';

import { createClient } from '@/utils/supabase/server';

const fetchGroups = async () => {
  const supabase = createClient();

  console.log('그룹 데이터 패칭 시도 중...');

  try {
    const { data, error, status } = await supabase
      .from('group') // 그룹 테이블에서 데이터 가져오기
      .select('*');

    if (error && status !== 406) {
      // 406: 'no rows'
      console.error('에러 발생:', error.message);
      throw new Error(`그룹 정보 요청 실패: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('그룹 정보가 없습니다.');
    }

    console.log('데이터 가져옴:', data);
    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error('에러 발생:', err.message);
      throw new Error(`데이터 패칭 중 오류 발생: ${err.message}`);
    } else {
      console.error('알 수 없는 에러 발생:', err);
      throw new Error('알 수 없는 에러가 발생했습니다.');
    }
  }
};

export default fetchGroups;
