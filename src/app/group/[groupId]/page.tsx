'use client';

import GroupAlbum from '@/components/groupDetail/GroupAlbum';
import GroupMap from '@/components/groupDetail/GroupMap';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useKakaoLoader } from 'react-kakao-maps-sdk';

const ToastContainer = dynamic(() => import('@/components/toast/GarlicToast'), { ssr: false });

type Props = Readonly<{
  params: { groupId: string };
}>;

const GroupPage = ({ params: { groupId } }: Props) => {
  const [isMap, setIsMap] = useState<boolean>(true);

  // const [loading, error] = useKakaoLoader({
  //   appkey: process.env.NEXT_PUBLIC_KAKAO_KEY!,
  //   libraries: ['services', 'clusterer'],
  // });

  // useEffect(() => {
  //   if (loading) return;
  // }, [loading]);

  return (
    <>
      <ToastContainer />
      <header className='flex justify-between px-5'>
        <Link href='/'>로고</Link>
        <h4>그룹명</h4>
        <button onClick={() => setIsMap((prev) => !prev)}>전환</button>
      </header>
      {isMap ? <GroupMap groupId={groupId} /> : <GroupAlbum />}
    </>
  );
};

export default GroupPage;
