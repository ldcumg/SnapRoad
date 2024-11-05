'use client';

import GroupInfoBox from './GroupInfoBox';
import useIntersect from '@/hooks/byUse/useIntersection';
import { getGroupPostsImagesQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import { GroupDetailMode, type GroupInfo } from '@/types/groupTypes';
import Link from 'next/link';

type Props = {
  groupId: string;
  groupInfo: GroupInfo;
  setMode: React.Dispatch<React.SetStateAction<GroupDetailMode>>;
};

const GroupAlbum = ({ groupId, groupInfo, setMode }: Props) => {
  const { data, isPending, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    getGroupPostsImagesQuery(groupId);
  const observerRef = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPage();
    }
  });

  if (isPending) return;

  if (isError) throw new Error(error.message);

  const postsImages = data.pages.flat();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <GroupInfoBox
        groupInfo={groupInfo}
        setMode={setMode}
      />
      {!!postsImages ? (
        <>
          <ol className='m-[15px] grid grid-cols-3 justify-items-center gap-1'>
            {postsImages.map((image) => (
              <li
                className='h-[112px] w-[112px] rounded-[8px] bg-cover'
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
