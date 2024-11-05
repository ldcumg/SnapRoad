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
  return (
    <>
      {randomData?.length ? (
        <Carousel
          className='w-full max-w-sm md:max-w-lg lg:max-w-full'
          plugins={[Autoplay({ delay: 3000 })]}
          opts={{ loop: true }}
        >
          <CarouselContent className='flex gap-4 pl-4'>
            {randomData?.map((data, index) => (
              <CarouselItem
                key={index}
                className='basis-[220px] md:basis-[300px] lg:basis-[400px] rounded-xl p-0'
              >
                <Card className='border-none'>
                  <CardContent
                    className='relative flex aspect-square items-center justify-center p-0 bg-contain bg-no-repeat bg-center md:bg-cover lg:bg-cover'
                    style={{ backgroundImage: `url(${data.post_thumbnail_image})` }}
                  >
                    <Link
                      href={`/write/${data.post_id}`}
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
        <></>
      )}
    </>
  );
};

export default RandomImage;
