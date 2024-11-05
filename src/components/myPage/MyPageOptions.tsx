import Link from 'next/link';
import React from 'react';

const MyPageOptions = () => {
  return (
    <div className='flex justify-center pt-16 pb-28 gap-5 bg-gray-50'>
      <Link href={'/mypage/account-setting'}>
        <span className='text-gray-500 text-caption_light_lg'>계정설정</span>
      </Link>
      {/* TODO 약관 정보 */}
      <Link href={''}>
        <span className='text-gray-500 text-caption_light_lg'>개인 정보 약관</span>
      </Link>
    </div>
  );
};

export default MyPageOptions;
