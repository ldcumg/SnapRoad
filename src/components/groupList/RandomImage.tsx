'use client';

import { Card, CardContent } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useGroupRandomImageQuery } from '@/hooks/queries/byUse/useGroupQueries';
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
                className='pl-1 basis-[200px]'
              >
                <div className='p-1'>
                  <Card>
                    <CardContent className='flex aspect-square items-center justify-center p-0'>
                      <img
                        src={data.post_thumbnail_image}
                        alt=''
                        className='w-[200px] h-[200px] object-contain'
                      />
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
