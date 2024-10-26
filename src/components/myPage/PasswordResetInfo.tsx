'use client';

import { sendEmailResetPassword } from '@/services/client-action/authClientAction';
import React, { useState } from 'react';

const PasswordResetInfo = () => {
  const [email, setEmail] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSendEmailResetPassword = async () => {
    try {
      const resetData = await sendEmailResetPassword(email);
      setSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col'>
      <p>가입시 사용했던 이메일 주소를 입력해주세요! 비밀번호 재설정 링크를 전송해 드립니다.</p>
      <input
        className='text-black'
        type='email'
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      {success && <div>이메일을 확인하세요</div>}
      <button onClick={handleSendEmailResetPassword}>재설정 링크 전송하기</button>
    </div>
  );
};

export default PasswordResetInfo;
