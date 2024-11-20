'use client';

import MakeGroupForm from '../makegroup/MakeGroupForm';
import GroupInfoBox from './GroupInfoBox';
import GroupPostList from './GroupPostList';
import Loading from '@/app/loading';
import useIntersect from '@/hooks/byUse/useIntersection';
import { useIsOpen } from '@/hooks/byUse/useIsOpen';
import { getGroupPostsImagesQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import { Modal } from '@/stories/Modal';
import { TopButton } from '@/stories/TopButton';
import type { GroupDetailMode, GroupInfo } from '@/types/groupTypes';

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
      <TopButton />
    </>
  );
};

export default GroupAlbum;
