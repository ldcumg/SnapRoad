import Link from 'next/link';
import React from 'react';

const MyPageOptions = () => {
  return (
    <div className='flex justify-center gap-5 bg-gray-50 pb-28 pt-16'>
      <Link href={'/mypage/account-setting'}>
        <span className='text-caption_light_lg text-gray-500 underline'>계정설정</span>
      </Link>
      <Link href={'/terms'}>
        <span className='text-caption_light_lg text-gray-500 underline'>개인 정보 약관</span>
      </Link>
    </div>
  );
};

export default MyPageOptions;
