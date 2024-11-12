'use client';

import Loading from '@/app/loading';
import GroupAlbum from '@/components/groupAlbum/GroupAlbum';
import MemberList from '@/components/groupAlbum/MemberList';
import GroupMap from '@/components/map/GroupMap';
import URLS from '@/constants/urls';
import { useGroupDetailModeStore } from '@/hooks/groupDetail/useGroupDetailModeStore';
import { useGroupInfoQuery } from '@/hooks/queries/byUse/useGroupQueries';
import { getGroupPostsImagesPrefetchQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import { GroupDetailMode } from '@/types/groupTypes';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const ToastContainer = dynamic(() => import('@/components/toast/GarlicToast'), { ssr: false });

type Props = Readonly<{ params: { groupId: string } }>;

const GroupPage = ({ params: { groupId } }: Props) => {
  const { mode, toMap, toAlbum } = useGroupDetailModeStore((state) => state);
  const prefetchGroupPostsImages = getGroupPostsImagesPrefetchQuery(groupId);

  const { data: groupInfo, isPending, isError, error } = useGroupInfoQuery(groupId);

  if (isPending) return <Loading />;

  if (isError) throw new Error(error.message);

  /** 조건부 렌더링 버튼 */
  const handleChangeMode = () => {
    switch (mode) {
      case GroupDetailMode.map:
        return (
          <button
            onClick={toAlbum}
            onMouseEnter={prefetchGroupPostsImages}
          >
            <img src='/svgs/Swap_Btn_To_Album.svg' />
          </button>
        );
      case GroupDetailMode.album:
        return (
          <button onClick={toMap}>
            <img src='/svgs/Swap_Btn_To_Map.svg' />
          </button>
        );
      case GroupDetailMode.member:
        return (
          <button
            className='h-10 w-10'
            onClick={toAlbum}
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
        return <GroupMap groupId={groupId} />;
      case GroupDetailMode.album:
        return (
          <GroupAlbum
            groupId={groupId}
            groupInfo={groupInfo}
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
      <header className='z-50 flex h-[56px] items-center justify-between bg-white px-4 py-2'>
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
