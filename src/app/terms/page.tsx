import AgreeList from '@/components/auth/AgreeList';
import MyPageBack from '@/components/myPage/MyPageBack';
import TermsAgreement from '@/components/myPage/TermsAgreement';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '약관 페이지',
  description: '약관 페이지 입니다.',
};

const TermsAgreementPage = () => {
  return (
    <div className='px-4'>
      <div className='relative flex items-center py-4'>
        <MyPageBack />
        <span className='mx-auto text-label_md text-gray-900'>개인정보 수집 · 이용 약관</span>
      </div>
      <div className='py-8'>
        <AgreeList />
      </div>
    </div>
  );
};

export default TermsAgreementPage;
