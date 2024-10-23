'use client';

import { getSession, signOut } from '@/services/server-action/authActions';
import { useEffect } from 'react';

const Page = () => {
  useEffect(() => {
    const fetchUser = async () => {
      const response = await getSession();
      console.log('response :>> ', response);
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div>
      <button onClick={handleSignOut}>테스트 로그아웃 버튼</button>
    </div>
  );
};

export default Page;
