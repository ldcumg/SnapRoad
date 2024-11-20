'use client';

import MakeGroupForm from '../makegroup/MakeGroupForm';
import GroupInfoBox from './GroupInfoBox';
import GroupPostList from './GroupPostList';
import Loading from '@/app/loading';
import useIntersect from '@/hooks/byUse/useIntersection';
import { useIsOpen } from '@/hooks/byUse/useIsOpen';
import { getGroupPostsImagesQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import { Modal } from '@/stories/Modal';
import type { GroupDetailMode, GroupInfo } from '@/types/groupTypes';
import Link from 'next/link';

type Props = {
  groupId: string;
  groupInfo: GroupInfo;
  setMode: React.Dispatch<React.SetStateAction<GroupDetailMode>>;
  desktop: boolean;
};

const GroupAlbum = ({ groupId, groupInfo, setMode, desktop }: Props) => {
  const { data, isPending, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    getGroupPostsImagesQuery(groupId);
  const [updateModal, handleUpdateModal] = useIsOpen();

  const observerRef = useIntersect((entry, observer) => {
    observer.unobserve(entry.target);

    hasNextPage && !isFetchingNextPage && !isFetching && fetchNextPage();
  });

  if (isPending) return <Loading />;

  if (isError) throw new Error(error.message);

  const postsImages = data.pages.flat();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  //TODO - 스켈레톤 UI
  return (
    <>
      {desktop && (
        <Modal
          isModalOpen={updateModal}
          handleModalOpen={handleUpdateModal}
          title='그룹 수정'
        >
          <MakeGroupForm
            update_for={groupId}
            handleUpdateModal={handleUpdateModal}
          />
        </Modal>
      )}
      <GroupInfoBox
        groupId={groupId}
        groupInfo={groupInfo}
        setMode={setMode}
        handleUpdateModal={handleUpdateModal}
        desktop={desktop}
      />
      <GroupPostList
        groupId={groupId}
        postsImages={postsImages}
        isFetchingNextPage={isFetchingNextPage}
        observerRef={observerRef}
      />
      {/* TODO - 스크롤 없을 시 숨기기 */}
      <button
        className='fixed bottom-4 right-4'
        onClick={handleScrollTop}
      >
        <img src='/svgs/Top_Btn.svg' />
      </button>
    </>
  );
};

export default GroupAlbum;
