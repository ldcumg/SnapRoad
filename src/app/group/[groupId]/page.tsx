'use client';

import GroupAlbum from '@/components/groupDetail/GroupAlbum';
import GroupMap from '@/components/groupDetail/GroupMap';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ToastContainer = dynamic(() => import('@/components/toast/GarlicToast'), { ssr: false });

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
  const [isMap, setIsMap] = useState<boolean>(true);

  return (
    <>
      <ToastContainer />
      <header className='flex justify-between px-5'>
        <span>로고</span>
        <h4>그룹명</h4>
        <button onClick={() => setIsMap((prev) => !prev)}>전환</button>
      </header>
      {isMap ? <GroupMap /> : <GroupAlbum />}
    </>
  );
};

export default GroupPage;
