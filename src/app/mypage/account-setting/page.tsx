'use client';

import { signOut } from '@/services/server-action/authActions';
import Link from 'next/link';
import React from 'react';

const AccountSetting = () => {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <div className='flex flex-col'>
      <Link href={'/mypage/password'}>비밀번호 변경</Link>
      <button onClick={handleSignOut}>로그아웃 </button>
    </div>
  );
};

export default AccountSetting;
