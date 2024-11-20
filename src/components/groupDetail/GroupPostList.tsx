'use client';

import type { PostImage } from '@/types/postTypes';
import Link from 'next/link';

type Props = {
  groupId: string;
  postsImages: PostImage[];
  isFetchingNextPage: boolean;
  observerRef: React.RefObject<HTMLDivElement>;
};

const GroupPostList = ({ groupId, postsImages, isFetchingNextPage, observerRef }: Props) => {
  return (
    <>
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
    </>
  );
};

export default GroupPostList;
