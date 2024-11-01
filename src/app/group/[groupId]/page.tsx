'use client';

import Logo from '@/../public/svgs/Logo.svg';
import GroupAlbum from '@/components/groupDetail/GroupAlbum';
import GroupMap from '@/components/groupDetail/GroupMap';
import MemberList from '@/components/groupDetail/MemberList';
import { useGroupInfoQuery } from '@/hooks/queries/byUse/useGroupQueries';
import { GroupDetailMode } from '@/types/groupTypes';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useKakaoLoader } from 'react-kakao-maps-sdk';

const ToastContainer = dynamic(() => import('@/components/toast/GarlicToast'), { ssr: false });

type Props = Readonly<{ params: { groupId: string } }>;

// const MODE = { map: 'map', album: 'album', member: 'member' };

const GroupPage = ({ params: { groupId } }: Props) => {
  const [mode, setMode] = useState<GroupDetailMode>(GroupDetailMode.album);

  const { data: groupInfo, isPending, isError, error } = useGroupInfoQuery(groupId);

  if (isPending) return <>로딩</>;

  if (isError) throw new Error(error.message);

  // const [loading, error] = useKakaoLoader({
  //   appkey: process.env.NEXT_PUBLIC_KAKAO_KEY!,
  //   libraries: ['services', 'clusterer'],
  // });

  // useEffect(() => {
  //   if (loading) return;
  // }, [loading]);

  const handleChangeMode = () => {
    switch (mode) {
      case GroupDetailMode.map:
        return <button onClick={() => setMode(GroupDetailMode.album)}>앨범</button>;
      case GroupDetailMode.album:
        return <button onClick={() => setMode(GroupDetailMode.map)}>지도</button>;
      case GroupDetailMode.member:
        return <button onClick={() => setMode(GroupDetailMode.album)}>X</button>;
      default:
        throw new Error('잘못된 요청입니다.');
    }
  };

  const changeMode = () => {
    switch (mode) {
      case GroupDetailMode.map:
        return <GroupMap groupId={groupId} />;
      case GroupDetailMode.album:
        return (
          <GroupAlbum
            groupId={groupId}
            groupInfo={groupInfo}
            setMode={setMode}
          />
        );
      case GroupDetailMode.member:
        return <MemberList />;
      default:
        throw new Error('잘못된 요청입니다.');
    }
  };

  return (
    <>
      <ToastContainer />
      <header className='flex justify-between px-5'>
        <Link href='/'>
          <Logo />
        </Link>
        <h3>{groupInfo.group_title}</h3>
        {handleChangeMode()}
      </header>
      {changeMode()}
    </>
  );
};

export default GroupPage;
