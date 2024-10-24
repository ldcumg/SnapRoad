'use client';

import GroupItem from './GroupItem';
import GroupItemSkeleton from './GroupItemSkeleton';
import useIntersect from '@/hooks/byUse/useIntersection';
import { useGroupListInfiniteQuery } from '@/hooks/queries/byUse/useGroupQueries';
import Link from 'next/link';

const GroupList = () => {
  const { isFetching, data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetchNextPageError } =
    useGroupListInfiniteQuery();
  const observerRef = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPage();
    }
  });

  const FlattedData = data?.pages.flat();
  if (isFetchNextPageError) throw new Error('에러 발생!');
  return (
    <div>
      {isFetching && !data ? (
        <GroupItemSkeleton />
      ) : FlattedData?.length ? (
        <ul className='grid grid-cols-2 gap-[15px]'>
          {FlattedData.map((el) => {
            return (
              <GroupItem
                key={el?.id}
                el={el}
              />
            );
          })}
        </ul>
      ) : (
        <div>
          <p>그룹을 만들어 추억을 남겨보세요!</p>
          <Link href={'/makegroup'}>그룹 만들기</Link>
        </div>
      )}
      {isFetchingNextPage && <div>fetching...</div>}
      <div
        id='observerTarget'
        ref={observerRef}
      ></div>
    </div>
  );
};

export default GroupList;
