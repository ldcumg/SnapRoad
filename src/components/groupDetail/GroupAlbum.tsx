'use client';

import MakeGroupForm from '../makegroup/MakeGroupForm';
import GroupInfoBox from './GroupInfoBox';
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
      {!!postsImages.length ? (
        <>
          <ol className='mx-auto grid grid-cols-3 justify-items-center gap-[4px] py-[15px] pc:grid-cols-5 pc:gap-[8px] pc:py-[40px]'>
            {postsImages.map((image) => (
              <li
                className='h-[112px] w-[112px] pc:h-[232px] pc:w-[232px]'
                key={image.id}
              >
                <Link
                  className='h-full w-full'
                  href={`/group/${groupId}/post/${image.post_id}`}
                >
                  <img
                    className='mx-auto my-auto h-full w-full rounded-[8px] object-cover pc:rounded-[12px]'
                    src={image.post_image_url}
                  />
                </Link>
              </li>
            ))}
          </ol>
          {isFetchingNextPage && <div className='mx-auto'>게시물을 불러오는 중입니다...</div>}
          <div
            className='bg-black'
            id='observerTarget'
            ref={observerRef}
          ></div>
        </>
      ) : (
        <div className='mt-[160px] flex h-full flex-col items-center text-title_lg text-gray-500 pc:mt-[264.5px]'>
          <span>게시물이 없습니다.</span>
          <span>추억을 공유해보세요!</span>
        </div>
      )}
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
