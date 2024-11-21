'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import useMediaQuery from '@/hooks/byUse/useMediaQuery';
import { ImageDetail } from '@/types/postDetailTypes';
import 'keen-slider/keen-slider.min.css';
import React, { useEffect, useMemo, useState } from 'react';

const PostDetailCarousel = ({ images }: { images: ImageDetail[] }) => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    setDesktop(isDesktop);
  }, [isDesktop]);

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const sortedImages = useMemo(
    () => images.slice().sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0)),
    [images],
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      <Carousel
      className="relative"
        orientation='horizontal'
        opts={{ loop: false }}
        setApi={setApi}
      >
        <CarouselContent>
          {sortedImages.map((image, index) => (
            <CarouselItem key={index}>
              <Card className='border-none'>
                <CardContent className='flex h-[375px] md:h-[588px] w-full items-center justify-center p-0'>
                  <img
                    src={image.signed_image_url!}
                    alt={'게시글 상세 이미지'}
                    className='h-full w-full object-cover'
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {desktop && images.length > 1 && (
          <>
                <CarouselPrevious className='absolute -left-8 top-1/2 z-[2] flex !h-10 !w-10 -translate-y-1/2 transform items-center justify-center rounded-full !border-0 bg-white text-gray-800 shadow-md hover:bg-gray-300' />
            <CarouselNext className='absolute -right-8 top-1/2 z-[2] flex !h-10 !w-10 -translate-y-1/2 transform items-center justify-center rounded-full !border-0 bg-white text-gray-800 shadow-md hover:bg-gray-300' />
          </>
        )}
      </Carousel>
      {images.length > 1 && (
        <ul className='flex justify-center gap-2 py-4'>
          {images.map((_, index) => {
            return (
              <li
                key={index}
                className={`h-[0.6rem] w-[0.6rem] rounded-full ${index + 1 === current ? 'bg-primary-400' : 'bg-gray-100'}`}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};

export default React.memo(PostDetailCarousel);
