'use client';

import { useGroupRandomImageQuery } from '@/hooks/queries/byUse/useGroupQueries';
import { useEffect } from 'react';

const RandomImage = () => {
  const { data, isLoading, refetch } = useGroupRandomImageQuery();
  useEffect(() => {
    const refetchInterval = setInterval(() => {
      refetch();
    }, 1000 * 10);
    data && refetchInterval;
    return () => clearInterval(refetchInterval);
  });

  if (isLoading) return <div className='w-[343px] h-[172px] bg-slate-400'>loading...</div>;
  return (
    <div>
      {data ? (
        <img
          src={data}
          alt=''
          className='w-[343px] h-[172px] object-contain'
        />
      ) : (
        <div>
          <div className='w-[343px] h-[172px] object-contain flex justify-center items-center'>
            <p>게시글을 작성하고 추억을 공유해보세요!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomImage;
