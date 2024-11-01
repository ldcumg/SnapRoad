'use client';

import { Card, CardContent } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useGroupRandomImageQuery } from '@/hooks/queries/byUse/useGroupQueries';
import { formatDateToYY_MM_DD } from '@/utils/dateUtils';
import { getSlicedAddress } from '@/utils/getSlicedAddress';
import Autoplay from 'embla-carousel-autoplay';

const RandomImage = () => {
  const { data: RandomData, isLoading } = useGroupRandomImageQuery();
  console.log('data :>> ', RandomData);

  if (isLoading) return <div className='w-[343px] h-[172px] bg-slate-400'>loading...</div>;
  return (
    <>
      {RandomData?.length ? (
        <Carousel
          className='w-full max-w-sm'
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          opts={{ loop: true }}
        >
          <CarouselContent className='-ml-1'>
            {RandomData?.map((data, index) => (
              <CarouselItem
                key={index}
                className='pl-1 basis-[220px] rounded-xl'
              >
                <div className='p-1'>
                  <Card>
                    <CardContent
                      className='relative flex aspect-square items-center justify-center p-0 bg-contain bg-no-repeat bg-center'
                      style={{ backgroundImage: `url(${data.post_thumbnail_image})` }}
                    >
                      <div className='absolute inset-0 bg-gradient-to-b from-white to-black opacity-50'></div>
                      <p className='absolute px-4 py-4 bottom-0 w-full text-white flex flex-row justify-between'>
                        <span className='text-title_lg'>{getSlicedAddress(data.post_address)}</span>
                        <span className='text-body_sm'>{formatDateToYY_MM_DD(data.created_at)}</span>
                      </p>
                    </CardContent>
                  </Card>
                </div>
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
