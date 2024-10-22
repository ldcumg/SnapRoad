import { fetchGroups } from '@/services/server-action/groupAction';
import { NextResponse } from 'next/server';

export async function GET() {

  try {
    const groups = await fetchGroups();
    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json({ error: '그룹 정보를 불러오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
