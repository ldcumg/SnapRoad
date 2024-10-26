'use client';

import Profile from '@/components/myPage/Profile';
import { useGetUserSession } from '@/hooks/queries/byUse/useAuthQueries';
import React from 'react';

interface UserSession {
  user: {
    id: string;
  };
}

/**
 * 이메일 회원가입 & 소셜 로그인 -> 처음에 profiles 의 유저 이미지 null
 */
const MyPage = () => {
  const { data, isLoading } = useGetUserSession() as { data: UserSession | null; isLoading: boolean };

  if (isLoading) return <>로딩중...</>;

  return <Profile userId={data?.user.id!} />;
};

export default MyPage;
