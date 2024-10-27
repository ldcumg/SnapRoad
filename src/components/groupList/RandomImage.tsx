'use client';

import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import { getRandomGroupId, getRandomThumbnail } from '@/services/server-action/groupServerActions';
import browserClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const RandomImage = () => {
  const { data, isLoading, isPending, isError, refetch } = useQuery({
    queryKey: ['groupImages'],
    queryFn: async () => {
      const { data } = await browserClient.auth.getUser();
      let url = '';
      if (data.user?.id) {
        const userId = data.user.id;
        const randomGroupData = await getRandomGroupId(userId);
        if (randomGroupData) {
          const thumbnailData = await getRandomThumbnail(randomGroupData);
          if (thumbnailData) url = (await getSignedImgUrl('tour_images', 20, `/group_name/${thumbnailData}`)) as string;
        }
      }
      return url;
    },
  });
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
