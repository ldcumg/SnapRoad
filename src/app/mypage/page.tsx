'use client';

import Profile from '@/components/myPage/Profile';
import { useGetUserSession } from '@/hooks/queries/byUse/useAuthQueries';
import Image from 'next/image';
import React, { useEffect } from 'react';

/**
 * 이메일 회원가입 & 소셜 로그인 -> 처음에 profiles 의 유저 이미지 null
 */
const MyPage = () => {
  const { data, isLoading } = useGetUserSession();

  if (isLoading) return <>로딩중...</>;

  return <Profile userId={data?.user.id} />;
};

export default MyPage;
