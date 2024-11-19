'use client';

import GroupAddButton from './GroupAddButton';
import GroupItem from './GroupItem';
import GroupItemSkeleton from './GroupItemSkeleton';
import useIntersect from '@/hooks/byUse/useIntersection';
import { useGroupListInfiniteQuery } from '@/hooks/queries/group/useGroupQueries';

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
  const dataLen = FlattedData?.length;
  if (isFetchNextPageError) throw new Error('에러 발생!');
  return (
    <>
      <GroupAddButton dataLen={dataLen} />
      <div className='flex w-full flex-col justify-between px-4'>
        {isFetching && !data ? (
          <GroupItemSkeleton />
        ) : FlattedData?.length ? (
          <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 pc:grid-cols-3'>
            {FlattedData.map((el) => {
              return (
                el && (
                  <GroupItem
                    key={el?.group_id}
                    el={el}
                  />
                )
              );
            })}
          </ul>
        ) : (
          <></>
        )}
        {isFetchingNextPage && <div>fetching...</div>}
        <div
          id='observerTarget'
          ref={observerRef}
        ></div>
      </div>
    </>
  );
};

export default GroupList;
