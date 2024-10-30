'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type TourImagesProps = {
  images: (string | undefined)[];
};

const TourImages = ({ images }: TourImagesProps) => {
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
        className='flex w-full h-[300px] justify-start items-center overflow-hidden'
      >
        <div
          ref={moveCarousel}
          className='flex w-full	h-full'
        >
          {images.map((image) =>
            image ? (
              <div
                key={image}
                className='flex-shrink-0 flex-[0_0_100%] relative h-full'
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
      {/* <div className='flex justify-around'>
        <button onClick={handleMovePrev}>앞</button>
        <button onClick={handleMoveNext}>뒤</button>
      </div> */}

      <ul className='flex gap-1 justify-center'>
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

export default TourImages;
