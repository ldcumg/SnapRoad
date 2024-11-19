'use client';

import ScrollReactHeader from '../_common/ScrollReactHeader';
import { useUserInfoQuery } from '@/hooks/queries/auth/useUserQuery';
import Link from 'next/link';

const LogoUserHeader = () => {
  const { data: userInfo, isPending: isUserInfoPending } = useUserInfoQuery();

  const isLoggedIn = userInfo?.user_nickname ? true : false;

  return (
    <ScrollReactHeader>
      <Link href={`${isLoggedIn ? '/grouplist' : '/'}`}>
        <img
          src='/svgs/Logo.svg'
          alt='로고'
        />
      </Link>
      {isUserInfoPending ? (
        <></>
      ) : isLoggedIn ? (
        <Link
          href={'/mypage'}
          prefetch
        >
          {userInfo?.user_image_url ? (
            <img
              src={userInfo.user_image_url}
              alt='유저이미지'
              className='h-10 w-10 rounded-[20px]'
            />
          ) : (
            <img
              src='/svgs/Profile.svg'
              className='h-10 w-10 rounded-[20px]'
            />
          )}
        </Link>
      ) : (
        <Link
          className='flex items-center p-2 text-label_md text-primary-400'
          href={'/login'}
        >
          로그인
        </Link>
      )}
    </ScrollReactHeader>
  );
};

export default LogoUserHeader;
