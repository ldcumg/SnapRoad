'use client';

import Profile from '@/components/myPage/Profile';
import { useGetUserSession } from '@/hooks/queries/byUse/useAuthQueries';
import Image from 'next/image';
import React, { useEffect } from 'react';

const MyPage = () => {
  const { data, isLoading } = useGetUserSession();

  //   console.log('MyPage data :>> ', data); // TODO 삭제

  if (isLoading) return <>로딩중...</>;

  return <Profile userId={data?.user.id} />;
};

export default MyPage;
