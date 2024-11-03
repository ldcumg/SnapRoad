'use client';

import Close_Member_List from '@/../public/svgs/Close_Member_List.svg';
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

const GroupPage = ({ params: { groupId } }: Props) => {
  const [mode, setMode] = useState<GroupDetailMode>(GroupDetailMode.map);

  const { data: groupInfo, isPending, isError, error } = useGroupInfoQuery(groupId);

  // const [loading, error] = useKakaoLoader({
  //   appkey: process.env.NEXT_PUBLIC_KAKAO_KEY!,
  //   libraries: ['services', 'clusterer'],
  // });

  // useEffect(() => {
  //   if (loading) return;
  // }, [loading]);

  if (isPending) return <>로딩</>;

  if (isError) throw new Error(error.message);

  /** 컴포넌트 조건부 렌더링 */
  const groupDetailMode = () => {
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
        return <MemberList groupInfo={groupInfo} />;
      default:
        throw new Error('잘못된 요청입니다.');
    }
  };

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
          <button onClick={() => setMode(GroupDetailMode.album)}>
            <Close_Member_List />
          </button>
        );
      default:
        throw new Error('잘못된 요청입니다.');
    }
  };

  return (
    <>
      <ToastContainer />
      <header className='flex justify-between px-5'>
        <Link href='/'>
          <img src='/svgs/Logo.svg' />
        </Link>
        <h2>{groupInfo.group_title}</h2>
        {handleChangeMode()}
      </header>
      {groupDetailMode()}
    </>
  );
};

export default GroupPage;
