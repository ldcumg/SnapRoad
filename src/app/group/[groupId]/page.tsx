'use client';

import GroupAlbum from '@/components/groupAlbum/GroupAlbum';
import MemberList from '@/components/groupAlbum/MemberList';
import GroupMap from '@/components/map/GroupMap';
import URLS from '@/constants/urls';
import { useGroupInfoQuery } from '@/hooks/queries/byUse/useGroupQueries';
import { GroupDetailMode } from '@/types/groupTypes';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';

const ToastContainer = dynamic(() => import('@/components/toast/GarlicToast'), { ssr: false });

type Props = Readonly<{
  params: { groupId: string };
  searchParams: { lat: string; lng: string };
}>;

const GroupPage = ({ params: { groupId }, searchParams: { lat, lng } }: Props) => {
  console.log('{ lat, lng } =>', { lat, lng });
  //TODO - zustand 관리
  const [mode, setMode] = useState<GroupDetailMode>(GroupDetailMode.map);

  const { data: groupInfo, isPending, isError, error } = useGroupInfoQuery(groupId);

  if (isPending) return <>로딩</>;

  if (isError) throw new Error(error.message);

  /** 조건부 렌더링 버튼 */
  const handleChangeMode = () => {
    switch (mode) {
      case GroupDetailMode.map:
        return (
          <button onClick={() => setMode(GroupDetailMode.album)}>
            <img src='/svgs/Swap_Btn_To_Album.svg' />
          </button>
        );
      case GroupDetailMode.album:
        return (
          <button onClick={() => setMode(GroupDetailMode.map)}>
            <img src='/svgs/Swap_Btn_To_Map.svg' />
          </button>
        );
      case GroupDetailMode.member:
        return (
          <button
            className='h-10 w-10'
            onClick={() => setMode(GroupDetailMode.album)}
          >
            <img
              className='mx-auto'
              src='/svgs/Close_Member_List.svg'
            />
          </button>
        );
      default:
        throw new Error('잘못된 요청입니다.');
    }
  };

  /** 컴포넌트 조건부 렌더링 */
  const groupDetailMode = () => {
    switch (mode) {
      case GroupDetailMode.map:
        return (
          <GroupMap
            groupId={groupId}
            point={lat && lng ? { lat: Number(lat), lng: Number(lng) } : null}
          />
        );
      case GroupDetailMode.album:
        return (
          <GroupAlbum
            groupId={groupId}
            groupInfo={groupInfo}
            setMode={setMode}
          />
        );
      case GroupDetailMode.member:
        return <MemberList groupInfo={groupInfo} />;
      default:
        throw new Error('잘못된 요청입니다.');
    }
  };

  return (
    <div className='flex h-screen flex-col'>
      <ToastContainer />
      <header className='flex h-[56px] items-center justify-between px-4 py-2'>
        <Link href={URLS.home}>
          <img src='/svgs/Logo.svg' />
        </Link>
        <h1 className='text-label_md'>{groupInfo.group_title}</h1>
        {handleChangeMode()}
      </header>
      {groupDetailMode()}
    </div>
  );
};

export default GroupPage;
