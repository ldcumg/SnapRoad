'use client';

import { Card, CardContent } from '../ui/card';
import RandomImageSkeleton from './RandomImageSkeleton';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useGroupRandomImageQuery } from '@/hooks/queries/byUse/useGroupQueries';
import { formatDateToYY_MM_DD } from '@/utils/dateUtils';
import { getSlicedAddress } from '@/utils/getSlicedAddress';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

const RandomImage = () => {
  const { data: randomData, isLoading } = useGroupRandomImageQuery();
  if (isLoading) return <RandomImageSkeleton />;

  const items = randomData ?? [];

  const carouselOptions = {
    loop: items.length > 2,
    plugins: items.length > 2 ? [Autoplay({ delay: 3000 })] : [],
  };
  const itemClassName = items.length === 1 ? 'justify-center' : 'gap-4 pl-4';

  return (
    <>
      {!!items.length ? (
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
                  <CardContent
                    className='relative flex aspect-square items-center justify-center p-0 bg-contain bg-no-repeat bg-center md:bg-cover lg:bg-cover'
                    style={{ backgroundImage: `url(${data.post_thumbnail_image})` }}
                  >
                    <Link
                      href={`/group/${data.group_id}/post/${data.post_id}`}
                      className='absolute inset-0 bg-gradient-to-b from-white to-black opacity-50 rounded-xl'
                    ></Link>
                    <p className='absolute px-4 py-4 bottom-0 w-full text-white flex flex-row justify-between'>
                      <span className='text-title_lg'>{getSlicedAddress(data.post_address)}</span>
                      <span className='text-body_sm'>{formatDateToYY_MM_DD(data.created_at)}</span>
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className='w-[220px] h-[220px] flex flex-col justify-center items-center pt-12 gap-9'>
          <img
            src='/svgs/Empty_Marker.svg'
            alt=''
          />
          <p className='flex flex-col justify-center'>
            <span className='text-center'>스냅로드로 추억을</span>
            <span className='text-center'>공유해보세요!</span>
          </p>
        </div>
      )}
    </>
  );
};

export default RandomImage;
