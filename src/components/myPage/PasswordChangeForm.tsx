'use client';

import { useGetUserSession } from '@/hooks/queries/byUse/useAuthMutations';
import React, { useState } from 'react';

const PasswordChangeForm = () => {
  const [email, setEmail] = useState<string>('');

  return (
    <div className='flex flex-col'>
      <p>가입시 사용했던 이메일 주소를 입력해주세요! 비밀번호 재설정 링크를 전송해 드립니다.</p>
      <input
        className='text-black'
        type='email'
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <button>재설정 링크 전송하기</button>
    </div>
  );
};

export default PasswordChangeForm;
