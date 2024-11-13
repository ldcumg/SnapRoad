'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ImageDetail } from '@/types/postDetailTypes';
import 'keen-slider/keen-slider.min.css';
import React, { useEffect, useMemo } from 'react';

const PostDetailCarousel = ({ images }: { images: ImageDetail[] }) => {
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
        orientation='horizontal'
        opts={{ loop: false }}
        setApi={setApi}
      >
        <CarouselContent>
          {sortedImages.map((image, index) => (
            <CarouselItem key={index}>
              <Card className='border-none'>
                <CardContent className='flex h-[375px] w-full items-center justify-center p-0'>
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
