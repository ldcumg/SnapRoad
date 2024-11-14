'use client';

import { Card, CardContent } from '../ui/card';
import RandomImageSkeleton from './RandomImageSkeleton';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useGroupRandomImageQuery } from '@/hooks/queries/group/useGroupQueries';
import queryKeys from '@/hooks/queries/queryKeys';
import { GroupWithCounts } from '@/types/groupTypes';
import { formatDateToYY_MM_DD } from '@/utils/dateUtils';
import { getSlicedAddress } from '@/utils/getSlicedAddress';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

const RandomImage = () => {
  const { data: randomData, isLoading } = useGroupRandomImageQuery();
  if (isLoading) return <RandomImageSkeleton />;
  const items = randomData ?? [];

  //NOTE - 소속 그룹이 없을 때 게시글 작성이 아닌 그룹 생성을 유도하기 위해 필요한 데이터
  const queryClient = useQueryClient();
  const groupListData: InfiniteData<GroupWithCounts[]> | undefined = queryClient.getQueryData(
    queryKeys.group.groupList(),
  );
  const groupListDataLen = groupListData?.pages[0].length;

  const carouselOptions = {
    loop: items.length > 2,
    plugins: items.length > 2 ? [Autoplay({ delay: 3000 })] : [],
  };
  const itemClassName = items.length === 1 ? 'justify-center' : 'gap-4 pl-4';
  return (
    <>
      {items.length > 0 ? (
        <Carousel
          className='w-full max-w-sm md:max-w-lg lg:max-w-full'
          plugins={carouselOptions.plugins}
          opts={{ loop: carouselOptions.loop }}
        >
          <CarouselContent className={`flex ${itemClassName}`}>
            {items.map((data, index) => (
              <CarouselItem
                key={index}
                className='basis-[220px] rounded-xl p-0'
              >
                <Card className='border-none'>
                  <CardContent className='relative flex aspect-square items-center justify-center p-0'>
                    <Link
                      href={`/group/${data.group_id}/post/${data.post_id}`}
                      className='absolute inset-0 rounded-xl'
                    >
                      <img
                        src={`${data.post_thumbnail_image}`}
                        alt={`${data.post_address}_사진`}
                        className='h-full w-full rounded-xl object-cover'
                      />
                    </Link>
                    <div className='absolute inset-0 h-[220px] w-[220px] rounded-xl bg-gradient-to-b from-transparent to-black'></div>
                    <p className='absolute bottom-0 flex w-full flex-row justify-between px-4 py-4 text-white'>
                      <span className='text-title_lg'>{getSlicedAddress(data.post_address)}</span>
                      <span className='text-body_sm'>{formatDateToYY_MM_DD(data.created_at)}</span>
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : !!groupListDataLen ? (
        <div className='flex h-[220px] w-[220px] flex-col items-center justify-center gap-9 pt-12'>
          <img
            src='/svgs/Empty_Marker.svg'
            alt=''
          />
          <p className='flex flex-col justify-center'>
            <span className='text-center'>스냅로드로 추억을</span>
            <span className='text-center'>공유해보세요!</span>
          </p>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default RandomImage;
