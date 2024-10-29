'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type TourImagesProps = {
  images: string[];
};

const TourImages = ({ images }: TourImagesProps) => {
  // 현재 선택한 사진의 인덱스를 확인하는 상태변수
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

  // useEffect 훅을 사용하여 currentIndex가 변경될 때만 실행되도록 설정
  useEffect(() => {
    if (moveCarousel.current) {
      // moveCarousel.current.style.transform = `translateX(-${currentIndex * 412}px)`;
      moveCarousel.current.style.transition = 'transform 0.5s ease';

      moveCarousel.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]); // currentIndex가 변경될 때마다 실행

  return (
    <>
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className='flex w-[412px] h-[300px] justify-start items-center overflow-hidden'
      >
        <div
          ref={moveCarousel}
          className='flex w-full	h-full'
        >
          {images.map((image) => (
            <Image
              key={image}
              src={image}
              alt={image}
              width={412}
              height={300}
            />
          ))}
          {/* <div
            style={{ backgroundColor: 'black', width: '412px', height: '300px' }}
            className='flex-shrink-0'
          />
          <div
            style={{ backgroundColor: 'red', width: '412px', height: '300px' }}
            className='flex-shrink-0'
          />
          <div
            style={{ backgroundColor: 'orange', width: '412px', height: '300px' }}
            className='flex-shrink-0'
          />
          <div
            style={{ backgroundColor: 'blue', width: '412px', height: '300px' }}
            className='flex-shrink-0'
          /> */}
        </div>
      </div>
      {/* <div className='flex justify-around'>
        <button onClick={handleMovePrev}>앞</button>
        <button onClick={handleMoveNext}>뒤</button>
      </div> */}
    </>
  );
};

export default TourImages;
