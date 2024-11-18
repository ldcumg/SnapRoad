'use client';

import MakeGroupForm from '../makegroup/MakeGroupForm';
import GroupInfoBox from './GroupInfoBox';
import Loading from '@/app/loading';
import useIntersect from '@/hooks/byUse/useIntersection';
import { useIsOpen } from '@/hooks/byUse/useIsOpen';
import useMediaQuery from '@/hooks/byUse/useMediaQuery';
import { getGroupPostsImagesQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import { Modal } from '@/stories/Modal';
import { type GroupDetailMode, type GroupInfo } from '@/types/groupTypes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = {
  groupId: string;
  groupInfo: GroupInfo;
  setMode: React.Dispatch<React.SetStateAction<GroupDetailMode>>;
};

const GroupAlbum = ({ groupId, groupInfo, setMode }: Props) => {
  const { data, isPending, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    getGroupPostsImagesQuery(groupId);
  const [updateModal, handleUpdateModal] = useIsOpen();
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    setDesktop(isDesktop);
  }, [isDesktop]);

  //NOTE - 고장
  const observerRef = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPage();
    }
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
      {!!postsImages.length ? (
        <>
          <ol className='m-[15px] grid grid-cols-3 justify-items-center gap-1'>
            {postsImages.map((image) => (
              <li
                className='h-[112px] w-[112px]'
                key={image.id}
              >
                <Link
                  className='h-full w-full'
                  href={`/group/${groupId}/post/${image.post_id}`}
                >
                  <img
                    className='mx-auto my-auto h-full w-full rounded-[8px] object-cover'
                    src={image.post_image_url}
                  />
                </Link>
              </li>
            ))}
          </ol>
          {isFetchingNextPage && <div className='mx-auto'>게시물을 불러오는 중입니다...</div>}
          <div
            id='observerTarget'
            ref={observerRef}
          ></div>
        </>
      ) : (
        <div className='mt-40 flex h-full flex-col items-center text-title_lg text-gray-500'>
          <p>게시물이 없습니다.</p>
          <p>추억을 공유해보세요!</p>
        </div>
      )}
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