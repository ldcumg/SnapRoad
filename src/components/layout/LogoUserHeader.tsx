'use client';

import { useUserInfoQuery } from '@/hooks/queries/byUse/useUserQuery';
import Link from 'next/link';

const LogoUserHeader = () => {
  const { data: userInfo, isPending: isUserInfoPending } = useUserInfoQuery();

  const isLoggedIn = userInfo?.user_nickname ? true : false;

  return (
    <>
      <Link href={`${isLoggedIn ? '/grouplist' : '/'}`}>
        <img
          src='/svgs/Logo.svg'
          alt='로고'
        />
      </Link>
      {isUserInfoPending ? (
        <></>
      ) : isLoggedIn ? (
        <Link href={'/mypage'}>
          <img
            src={`${userInfo?.user_image_url ? userInfo.user_image_url : '/svgs/User.svg'}`}
            alt='유저이미지'
            className='rounded-[20px] w-10 h-10'
          />
        </Link>
      ) : (
        <Link
          className='flex items-center p-2 text-label_md text-primary-400'
          href={'/login'}
        >
          로그인
        </Link>
      )}
    </>
  );
};

export default LogoUserHeader;
