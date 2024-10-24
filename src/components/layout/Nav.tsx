'use client';

import browserClient from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const getUserGroup = async (userId: string) => {
  const { data, error } = await browserClient.from('user_group').select('group_id').eq('user_id', userId);
  if (error) {
    console.error('내그룹 없음:', error);
    return null;
  }

  return data && data.length > 0 ? data[0].group_id : null; // 첫 번째 그룹 ID 반환
};

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null); 
  const router = useRouter(); 

  useEffect(() => {
    const checkUserSession = async () => {
      const {
        data: { session },
      } = await browserClient.auth.getSession();

      if (session) {
        setIsLoggedIn(true);
        const user = session.user;
        const name = user.user_metadata?.full_name || user.email;
        setUserName(name);

        // 사용자가 속한 첫 번째 그룹 ID 가져오기
        const fetchedGroupId = await getUserGroup(user.id);
        if (fetchedGroupId) {
          setGroupId(fetchedGroupId);
        }
      }
    };

    checkUserSession();
  }, []);

  const loginWithGithub = async () => {
    await browserClient.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.origin + '/auth/callback',
      },
    });
  };

  const logout = async () => {
    await browserClient.auth.signOut();
    setIsLoggedIn(false);
    setUserName(null);
    setGroupId(null); // 로그아웃 시 그룹 아이디 초기화
  };

  const goToGroup = () => {
    if (groupId) {
      router.push(`/group/${groupId}`);
    } else {
      alert('그룹 정보를 찾을 수 없습니다.');
    }
  };

  return (
    <nav>
      <ul className='flex flex-row gap-2'>
        <li>
          <Link href={`/tour`}>이미지업로드</Link>
        </li>
        {!isLoggedIn ? (
          <>
            <li>
              <button onClick={loginWithGithub}>login</button>
            </li>
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
              <span>{userName}님</span>
            </li>
            <li>
              <button onClick={logout}>logout</button>
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
