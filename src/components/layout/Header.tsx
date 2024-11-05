'use client';

import { getSession, getUserData } from '@/services/server-action/authActions';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type UserDataType = {
  user_nickname: string | null;
  user_image_url: string | null;
} | null;

const Header = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [userInfo, setUserInfo] = useState<UserDataType>(null);
  useEffect(() => {
    const getUser = async () => {
      const user = await getSession();
      if (user?.id) {
        setUserInfo(await getUserData(user.id));
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isLoggedIn = userInfo?.user_nickname ? true : false;

  return (
    <div
      className={`fixed z-[2] top-0 left-0 right-0 bg-white transition-all duration-300 py-2 px-4 flex flex-row justify-between ${
        hasScrolled ? 'border-b border-gray-300' : 'border-b-0'
      }`}
    >
      <Link href={`${isLoggedIn ? '/grouplist' : '/'}`}>
        <img
          src='/svgs/Logo.svg'
          alt='로고'
        />
      </Link>
      {isLoggedIn ? (
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
    </div>
  );
};

export default Header;
