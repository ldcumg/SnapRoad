'use client';

import GroupAlbum from '@/components/groupDetail/GroupAlbum';
import GroupMap from '@/components/groupDetail/GroupMap';
import { useState } from 'react';

type Props = {
  // params: { groupId: string };
  // searchParams: { 위치명:string, lat:string,lng:string }
};

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
      <header className='flex justify-between px-5'>
        <span>로고</span>
        <button onClick={() => handleToggle('isDetail')}>그룹명</button>
        <button onClick={() => handleToggle('isMap')}>전환</button>
      </header>
      {isToggleOn.isMap ? <GroupMap /> : <GroupAlbum />}
      <button>추가하기</button>
    </>
  );
};

export default GroupPage;
