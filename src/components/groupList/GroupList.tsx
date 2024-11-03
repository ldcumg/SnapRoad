'use client';

import BlankGroupList from './BlankGroupList';
import GroupAddButton from './GroupAddButton';
import GroupItem from './GroupItem';
import GroupItemSkeleton from './GroupItemSkeleton';
import useIntersect from '@/hooks/byUse/useIntersection';
import { useGroupListInfiniteQuery } from '@/hooks/queries/byUse/useGroupQueries';

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
      {/* 데이터 fetching중 버튼이 깜빡이지 않도록 */}
      {!isFetching ? <GroupAddButton dataLen={dataLen} /> : <div className='h-4'></div>}
      <div className='w-full px-4 flex flex-col justify-between'>
        {isFetching && !data ? (
          <GroupItemSkeleton />
        ) : FlattedData?.length ? (
          <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center w-full'>
            {FlattedData.map((el) => {
              return (
                <GroupItem
                  key={el?.group_id}
                  el={el}
                />
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
