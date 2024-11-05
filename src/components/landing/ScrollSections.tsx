'use client';

import { Button } from '@/stories/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const ScrollSections = () => {
  const router = useRouter();
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);
  const section3Ref = useRef<HTMLElement>(null);
  const section4Ref = useRef<HTMLElement>(null);
  const section5Ref = useRef<HTMLElement>(null);
  const section6Ref = useRef<HTMLElement>(null);
  const sections = [section1Ref, section2Ref, section3Ref, section4Ref, section5Ref, section6Ref];

  const totalPage = sections.length;
  const lastPage = totalPage - 1;
  let page = 0;
  let startY = 0;
  let endY = 0;

  useEffect(() => {
    const handleScrolling = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        page++;
      } else if (e.deltaY < 0) {
        page--;
      }
      if (page < 0) {
        page = 0;
      } else if (page > lastPage) {
        page = lastPage;
      }
      sections[page].current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      endY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (startY - endY > 50) {
        page++;
      } else if (startY - endY < -50) {
        page--;
      }
      if (page < 0) {
        page = 0;
      } else if (page > lastPage) {
        page = lastPage;
      }
      sections[page].current?.scrollIntoView({ behavior: 'smooth' });
    };

    window.addEventListener('wheel', handleScrolling, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleScrolling);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sections, lastPage]);

  return (
    <div>
      <section
        ref={section1Ref}
        className='h-screen pt-24 flex flex-col justify-center items-center gap-5'
      >
        <div className='flex flex-col justify-center items-center'>
          <p className='text-label_md text-gray-900'>스냅로드 지도위에</p>
          <p>
            <span className='text-title_lg text-primary-400'>추억</span>
            <span className='text-label_md text-gray-900'>을 남겨보세요!</span>
          </p>
        </div>
        <Button
          label='로그인하여 시작'
          onClick={() => router.push('/login')}
        ></Button>
        <div className='relative w-full max-w-[400px]'>
          <img
            src='/images/landing/01_landing.jpg'
            alt=''
            className='w-full h-auto'
          />
          <div className='absolute top-0 w-full h-full bg-white-to-transparent-to-white'></div>
        </div>
      </section>
      <section
        ref={section2Ref}
        className='h-screen pt-14 bg-green-100'
      ></section>
      <section
        ref={section3Ref}
        className='h-screen pt-14 bg-blue-100'
      ></section>
    </div>
  );
};

export default ScrollSections;
