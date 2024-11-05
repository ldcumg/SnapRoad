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
        className='h-screen pt-24 flex flex-col items-center gap-5'
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
            alt='지도 마커 예시 사진'
            className='w-full h-auto'
          />
          <div className='absolute top-0 w-full h-full bg-white-to-transparent-to-white'></div>
        </div>
      </section>
      <section
        ref={section2Ref}
        className='h-screen pt-24 flex flex-col items-center gap-7'
      >
        <div className='flex flex-col justify-center items-center'>
          <p className='text-label_md'>
            <span className='text-gray-900'>우리들만의 </span>
            <span className='text-primary-400'>프라이빗</span>
            <span className='text-gray-900'>한 그룹을 만들어</span>
          </p>
          <p className='text-label_md'>
            <span className='text-gray-900'>같이한 여행을 </span>
            <span className='text-primary-400'>기록하고 공유</span>
            <span className='text-gray-900'>해요!</span>
          </p>
        </div>
        <div className='w-full max-w-[400px]'>
          <img
            src='/images/landing/02_landing.jpg'
            alt='그룹리스트페이지 예시 사진'
            className='w-full h-auto'
          />
        </div>
      </section>
      <section
        ref={section3Ref}
        className='h-screen pt-24 flex flex-col items-center gap-7'
      >
        <div className='flex flex-col justify-center items-center'>
          <p className='text-label_md'>
            <span className='text-primary-400'>피드에 업로드한 게시물</span>
            <span className='text-gray-900'>들은</span>
          </p>
          <p className='text-label_md text-gray-900'>시간 순으로 지도위에 연결되어 표시돼요!</p>
        </div>
        <div className='w-full max-w-[400px]'>
          <img
            src='/images/landing/03_landing.jpg'
            alt='그룹 앨범 예시 사진'
            className='w-full h-auto'
          />
        </div>
      </section>
      <section
        ref={section4Ref}
        className='h-screen pt-24 flex flex-col items-center gap-7'
      >
        <div className='flex flex-col justify-center items-center'>
          <p className='text-label_md text-gray-900'>피드에 업로드한 게시물들은</p>
          <p className='text-label_md'>
            <span className='text-primary-400'>시간순으로 지도위에 연결되어 표시</span>
            <span className='text-gray-900'>돼요!</span>
          </p>
        </div>
        <div className='w-full max-w-[400px]'>
          <img
            src='/images/landing/04_landing.jpg'
            alt='그룹 지도 예시 사진'
            className='w-full h-auto'
          />
        </div>
      </section>
      <section
        ref={section5Ref}
        className='h-screen pt-24 flex flex-col items-center gap-7'
      >
        <div className='flex flex-col justify-center items-center'>
          <p className='text-label_md'>
            <span className='text-primary-400'>사진을 게시</span>
            <span className='text-gray-900'>하여</span>
          </p>
          <p className='text-label_md'>
            <span className='text-gray-900'>그 곳에서의</span>
            <span className='text-primary-400'>추억을 글로</span>
            <span className='text-gray-900'>남겨봐요!</span>
          </p>
        </div>
        <div className='w-full max-w-[400px]'>
          <img
            src='/images/landing/05_landing.jpg'
            alt='게시글 상세 예시 사진'
            className='w-full h-auto'
          />
        </div>
      </section>
      <section
        ref={section6Ref}
        className='h-screen pt-24 flex flex-col items-center gap-7'
      >
        <div className='flex flex-col justify-center items-center'>
          <p className='text-label_md text-gray-900'>그룹내 멤버들과</p>
          <p className='text-label_md'>
            <span className='text-primary-400'>댓글을 남기며 추억</span>
            <span className='text-gray-900'>을 나눠봐요!</span>
          </p>
        </div>
        <div className='w-full max-w-[400px]'>
          <img
            src='/images/landing/06_landing.jpg'
            alt='그룹 지도 예시 사진'
            className='w-full h-auto'
          />
        </div>
      </section>
    </div>
  );
};

export default ScrollSections;
