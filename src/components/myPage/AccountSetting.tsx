'use client';

import { useSignOut } from '@/hooks/queries/byUse/useAuthMutations';
import { signOut } from '@/services/server-action/authActions';
import Link from 'next/link';
import React from 'react';

const AccountSetting = () => {
  const { mutate: signOut } = useSignOut();

  const handleSignOut = async () => {
    signOut();
  };
  return (
    <div className='mt-12 flex flex-col items-start gap-8'>
      <Link href={'/mypage/password'}>
        <span className='text-title_lg text-black'>비밀번호 찾기 · 변경</span>
      </Link>

      <button onClick={handleSignOut}>
        <span className='text-title_lg text-black'>로그아웃</span>
      </button>
    </div>
  );
};

export default AccountSetting;
