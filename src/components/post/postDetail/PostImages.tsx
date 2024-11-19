'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type PostImagesProps = {
  images: (string | undefined)[];
};

const PostImages = ({ images }: PostImagesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchX, setTouchX] = useState(0);
  const [touchY, setTouchY] = useState(0);

  const moveCarousel = useRef<HTMLInputElement>(null);

  /** 이전 */
  const handleMovePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  /** 다음 */
  const handleMoveNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchX(e.changedTouches[0].pageX);
    setTouchY(e.changedTouches[0].pageY);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const distanceX = touchX - e.changedTouches[0].pageX;
    const distanceY = touchY - e.changedTouches[0].pageY;
    const vector = Math.abs(distanceX / distanceY);

    if (distanceX > 30 && vector > 2) {
      handleMoveNext();
    } else if (distanceX < -30 && vector > 2) {
      handleMovePrev();
    }
  };

  useEffect(() => {
    if (moveCarousel.current) {
      moveCarousel.current.style.transition = 'transform 0.5s ease';
      moveCarousel.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  return (
    <>
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className='flex h-[300px] w-full items-center justify-start overflow-hidden'
      >
        <div
          ref={moveCarousel}
          className='flex h-full w-full'
        >
          {images.map((image) =>
            image ? (
              <div
                key={image}
                className='relative h-full flex-[0_0_100%] flex-shrink-0'
              >
                <Image
                  key={image}
                  src={image}
                  alt={image}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : null,
          )}
        </div>
      </div>
      {/* PC 버전 */}
      {/* <div className='flex justify-around'>
        <button onClick={handleMovePrev}>앞</button>
        <button onClick={handleMoveNext}>뒤</button>
      </div> */}
      <ul className='flex justify-center gap-1'>
        {images.map((_, index) => {
          return (
            <li
              key={index}
              className={`h-[0.6rem] w-[0.6rem] rounded-full ${index === currentIndex ? 'bg-black' : 'bg-gray-300'}`}
            />
          );
        })}
      </ul>
    </>
  );
};

export default PostImages;
