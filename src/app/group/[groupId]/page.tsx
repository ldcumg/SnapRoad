'use client';

import Loading from '@/app/loading';
import GroupAlbum from '@/components/groupDetail/GroupAlbum';
import GroupDetailHeader from '@/components/groupDetail/GroupDetailHeader';
import MemberList from '@/components/groupDetail/MemberList';
import GroupMap from '@/components/map/GroupMap';
import { useGroupInfoQuery } from '@/hooks/queries/group/useGroupQueries';
import { GroupDetailMode } from '@/types/groupTypes';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ToastContainer = dynamic(() => import('@/components/toast/GarlicToast'), { ssr: false });

type Props = Readonly<{
  params: { groupId: string };
  searchParams: { lat: string; lng: string };
}>;

const GroupPage = ({ params: { groupId }, searchParams: { lat, lng } }: Props) => {
  const [mode, setMode] = useState<GroupDetailMode>(GroupDetailMode.map);

  const { data: groupInfo, isPending, isError, error } = useGroupInfoQuery(groupId);

  if (isPending) return <Loading />;

  if (isError) throw new Error(error.message);

  /** 컴포넌트 조건부 렌더링 */
  const groupDetailMode = () => {
    switch (mode) {
      case GroupDetailMode.map:
        return (
          <GroupMap
            groupId={groupId}
            point={lat && lng ? { lat: Number(lat), lng: Number(lng) } :undefined}
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
      <GroupDetailHeader
        groupTitle={groupInfo.group_title}
        mode={mode}
        setMode={setMode}
      />
      {groupDetailMode()}
    </div>
  );
};

export default GroupPage;
