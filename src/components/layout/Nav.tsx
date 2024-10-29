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

  return data && data.length > 0 ? data[0].group_id : null; // 첫 번째 그룹 ID 반환
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
    enabled: !!session, // 세션이 있어야 쿼리가 실행됨
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
      refetch(); // 로그인 후 세션을 다시 가져옴
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

  const goToGroup = () => {
    if (groupId) {
      router.push(`/group/${groupId}`);
    } else {
      alert('그룹 정보를 찾을 수 없습니다.');
    }
  };

  // 세션이나 그룹 관련 에러가 발생하면 처리
  if (sessionError) console.error('세션 가져오기 실패:', sessionError);
  if (groupError) console.error('그룹 정보 가져오기 실패:', groupError);
  if (sessionLoading || groupLoading) return <div>로딩 중...</div>;

  return (
    <nav>
      <ul className='flex flex-row gap-2'>
        <li>
          <Link href={`/tour`}>이미지업로드</Link>
        </li>
        {!session ? (
          <>
            {/* <li>
              <button onClick={() => loginMutation.mutate()}>login</button>
            </li> */}
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
              <button
                onClick={goToGroup}
                disabled={!groupId}
              >
                내 그룹으로 이동
              </button>
            </li>
            <li>
              <Link href={'/makegroup'}>그룹 만들기</Link>
            </li>
            <li>
              <Link href={`/mypage`}>마이페이지</Link>
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
