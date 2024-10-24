'use client';

import GroupAlbum from '@/components/groupDetail/GroupAlbum';
import GroupMap from '@/components/groupDetail/GroupMap';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ToastContainer = dynamic(() => import('@/components/GarlicToast'), { ssr: false });

type Props = Readonly<{
  // params: { groupId: string };
  // searchParams: { 위치명:string, lat:string,lng:string }
}>;

const GroupPage = (
  {
    // params: { groupId },
    // searchParams: {위치명, lat,lng }
  }: Props,
) => {
  const [isToggleOn, setIsToggleOn] = useState<{ [key: string]: boolean }>({
    isMap: true,
    isDetail: false,
  });

  const handleToggle = (target: string) => {
    setIsToggleOn((prev) => {
      return { ...prev, [target]: !prev[target] };
    });
  };

  return (
    <>
      <ToastContainer />
      <header className='flex justify-between px-5'>
        <span>로고</span>
        <button onClick={() => handleToggle('isDetail')}>그룹명</button>
        <button onClick={() => handleToggle('isMap')}>전환</button>
      </header>
      {isToggleOn.isDetail && <div>상세 정보</div>}
      {isToggleOn.isMap ? <GroupMap /> : <GroupAlbum />}
    </>
  );
};

export default GroupPage;
