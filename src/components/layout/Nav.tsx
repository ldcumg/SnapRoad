'use client';

import browserClient from '@/utils/supabase/client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      const {
        data: { session },
      } = await browserClient.auth.getSession();
      setIsLoggedIn(!!session);
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
  };

  return (
    <nav>
      <ul className='flex flex-row gap-2'>
        <li>
          <Link href={`/group`}>그룹</Link>
        </li>
        <li>
          <Link href={`/login`}>로그인</Link>
        </li>
        <li>
          <Link href={`/signup`}>회원가입</Link>
        </li>
        <li>
          <Link href={`/tour`}>이미지업로드</Link>
        </li>
        <li>
          {isLoggedIn ? <button onClick={logout}>logout</button> : <button onClick={loginWithGithub}>login</button>}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
