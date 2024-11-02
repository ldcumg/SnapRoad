'use client';

import { Card, CardContent } from '../ui/card';
import RandomImageSkeleton from './RandomImageSkeleton';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useGroupRandomImageQuery } from '@/hooks/queries/byUse/useGroupQueries';
import { formatDateToYY_MM_DD } from '@/utils/dateUtils';
import { getSlicedAddress } from '@/utils/getSlicedAddress';
import Autoplay from 'embla-carousel-autoplay';

const RandomImage = () => {
  const { data: RandomData, isLoading } = useGroupRandomImageQuery();

  if (isLoading) return <RandomImageSkeleton />;
  return (
    <>
      {RandomData?.length ? (
        <Carousel
          className='w-full' //max-w-sm
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          opts={{ loop: true }}
        >
          <CarouselContent className='flex gap-4 pl-4'>
            {RandomData?.map((data, index) => (
              <CarouselItem
                key={index}
                className='basis-[220px] rounded-xl p-0'
              >
                <Card className='border-none'>
                  <CardContent
                    className='relative flex aspect-square items-center justify-center p-0 bg-contain bg-no-repeat bg-center'
                    style={{ backgroundImage: `url(${data.post_thumbnail_image})` }}
                  >
                    <div className='absolute inset-0 bg-gradient-to-b from-white to-black opacity-50 rounded-xl'></div>
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
