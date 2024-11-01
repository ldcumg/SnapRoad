'use client';

import browserClient from '@/utils/supabase/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 그룹 ID
const fetchUserGroup = async (userId: string) => {
  const { data, error } = await browserClient.from('user_group').select('group_id').eq('user_id', userId);
  if (error) {
    console.error('내그룹 없음:', error);
    return null;
  }

  return data && data.length > 0 ? data[0].group_id : null;
};

// 사용자 세션
const fetchUserSession = async () => {
  const {
    data: { session },
  } = await browserClient.auth.getSession();
  return session;
};

const Nav = () => {
  const router = useRouter();

  // 사용자 세션
  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
    refetch,
  } = useQuery({
    queryKey: ['userSession'],
    queryFn: fetchUserSession,
  });

  const userName = session?.user?.user_metadata?.full_name || session?.user?.email || null;

  // 그룹 ID
  const {
    data: groupId,
    isLoading: groupLoading,
    error: groupError,
  } = useQuery({
    queryKey: ['userGroup', session?.user?.id],
    queryFn: () => fetchUserGroup(session?.user?.id || ''),
    enabled: !!session,
  });

  // 로그인
  const loginMutation = useMutation({
    mutationFn: async () => {
      return await browserClient.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.origin + '/api/auth/callback',
        },
      });
    },
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      console.error('로그인 에러');
    },
  });

  // 로그아웃
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await browserClient.auth.signOut();
    },
    onSuccess: () => {
      refetch(); // 로그아웃 후 세션을 다시 가져옴
    },
    onError: () => {
      console.error('로그아웃 에러');
    },
  });

  if (sessionError) console.error('세션 가져오기 실패:', sessionError);
  if (groupError) console.error('그룹 정보 가져오기 실패:', groupError);
  if (sessionLoading || groupLoading) return <div>로딩 중...</div>;

  return (
    <nav>
      <ul className='flex flex-row gap-2'>
        <li>
          <Link href={`/`}>메인</Link>
        </li>
        <li>
          <Link href={`/group/a6706b3b-6a01-4ffc-ac68-49d8872dbd5d/post`}>포스트 쓰기</Link>
        </li>
        <li>
          <Link href={`/guide`}>스타일 가이드</Link>
        </li>
        {!session ? (
          <>
            <li>
              <Link href={`/login`}>로그인</Link>
            </li>
            <li>
              <Link href={`/signup`}>회원가입</Link>
            </li>
          </>
        ) : (
          <div className='flex gap-3'>
            <li>
              <Link href={'/grouplist'}>그룹 리스트</Link>
            </li>
            <li>
              <Link href={'/makegroup'}>그룹 만들기</Link>
            </li>
            <li>
              <Link href={`/mypage`}>mypage</Link>
            </li>
            <li>
              <span>{userName}님</span>
            </li>
            <li>
              <button onClick={() => logoutMutation.mutate()}>logout</button>
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
