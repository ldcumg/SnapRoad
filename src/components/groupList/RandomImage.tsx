'use client';

import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import browserClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const RandomImage = () => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['groupImages'],
    queryFn: async () => {
      const { data } = await browserClient.auth.getUser();
      let url = '';
      if (data.user?.id) {
        const userId = data.user.id;
        const { data: randomGroupData, error: randomGroupError } = await browserClient.rpc('get_group_id_by_user', {
          insert_user_id: userId,
        });
        if (randomGroupData) {
          const { data: thumbnailData, error: thumbnailError } = await browserClient.rpc(
            'get_group_thumbnail_by_group_id',
            {
              input_group_id: randomGroupData,
            },
          );
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
    refetchInterval;
    return () => clearInterval(refetchInterval);
  });
  return (
    <div>
      {data && (
        <img
          src={data}
          alt=''
          className='w-[343px] h-[172px] object-contain'
        />
      )}
    </div>
  );
};

export default RandomImage;
