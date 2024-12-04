'use client';

import image1 from '@/public/images/landing/01_landing.webp';
import image2 from '@/public/images/landing/02_landing.webp';
import image3 from '@/public/images/landing/03_landing.webp';
import image4 from '@/public/images/landing/04_landing.webp';
import image5 from '@/public/images/landing/05_landing.webp';
import image6 from '@/public/images/landing/06_landing.webp';
import { LinkButton } from '@/stories/LinkButton';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

const ScrollSections = () => {
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

    window.addEventListener('wheel', handleScrolling, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleScrolling);
    };
  }, [sections, lastPage]);

  return (
    <div className='flex flex-col gap-[164px]'>
      <section
        ref={section1Ref}
        className='flex h-screen flex-col items-center justify-center gap-5 pt-14'
      >
        <div className='flex flex-col items-center justify-center'>
          <p className='text-label_md text-gray-900'>스냅로드 지도위에</p>
          <p>
            <span className='text-title_lg text-primary-400'>추억</span>
            <span className='text-label_md text-gray-900'>을 남겨보세요!</span>
          </p>
        </div>
        <LinkButton
          label='로그인하여 시작'
          href='/login'
        />
        <div className='relative w-full max-w-[400px]'>
          <Image
            src={image1}
            alt='지도 마커 예시 사진'
            sizes='400px'
            priority
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
          <div className='absolute top-0 h-full w-full bg-white-to-transparent-to-white'></div>
        </div>
      </section>
      <section
        ref={section2Ref}
        className='flex h-screen flex-col items-center justify-center gap-7 px-4 pt-14'
      >
        <div className='flex flex-col items-center justify-center'>
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
        <div className='relative flex w-full max-w-[400px] justify-center rounded-xl shadow-BG_Broad'>
          <Image
            src={image2}
            alt='그룹리스트페이지 예시 사진'
            sizes='400px'
            style={{
              width: '343px',
              height: 'auto',
              borderRadius: '12px',
            }}
          />
        </div>
      </section>
      <section
        ref={section3Ref}
        className='flex h-screen flex-col items-center justify-center gap-7 px-4 pt-14'
      >
        <div className='flex flex-col items-center justify-center'>
          <p className='text-label_md'>
            <span className='text-primary-400'>피드에 업로드한 게시물</span>
            <span className='text-gray-900'>들은</span>
          </p>
          <p className='text-label_md text-gray-900'>시간 순으로 지도위에 연결되어 표시돼요!</p>
        </div>
        <div className='relative flex w-full max-w-[400px] justify-center rounded-xl shadow-BG_Broad'>
          <Image
            src={image3}
            alt='그룹 앨범 예시 사진'
            sizes='400px'
            style={{
              width: '343px',
              height: 'auto',
              borderRadius: '12px',
            }}
          />
        </div>
      </section>
      <section
        ref={section4Ref}
        className='flex h-screen flex-col items-center justify-center gap-7 px-4 pt-14'
      >
        <div className='flex flex-col items-center justify-center'>
          <p className='text-label_md text-gray-900'>피드에 업로드한 게시물들은</p>
          <p className='text-label_md'>
            <span className='text-primary-400'>시간순으로 지도위에 연결되어 표시</span>
            <span className='text-gray-900'>돼요!</span>
          </p>
        </div>
        <div className='relative flex w-full max-w-[400px] justify-center rounded-xl shadow-BG_Broad'>
          <Image
            src={image4}
            alt='그룹 지도 예시 사진'
            sizes='400px'
            style={{
              width: '343px',
              height: 'auto',
              borderRadius: '12px',
            }}
          />
        </div>
      </section>
      <section
        ref={section5Ref}
        className='flex h-screen flex-col items-center justify-center gap-7 px-4 pt-14'
      >
        <div className='flex flex-col items-center justify-center'>
          <p className='text-label_md'>
            <span className='text-primary-400'>사진을 게시</span>
            <span className='text-gray-900'>하여</span>
          </p>
          <p className='text-label_md'>
            <span className='text-gray-900'>그 곳에서의 </span>
            <span className='text-primary-400'>추억을 글로 </span>
            <span className='text-gray-900'>남겨봐요!</span>
          </p>
        </div>
        <div className='relative flex w-full max-w-[400px] justify-center rounded-xl shadow-BG_Broad'>
          <Image
            src={image5}
            alt='게시글 상세 예시 사진'
            sizes='400px'
            style={{
              width: '343px',
              height: 'auto',
              borderRadius: '12px',
            }}
          />
        </div>
      </section>
      <section
        ref={section6Ref}
        className='flex h-screen flex-col items-center justify-center gap-7 px-4 pt-14'
      >
        <div className='flex flex-col items-center justify-center'>
          <p className='text-label_md text-gray-900'>그룹내 멤버들과</p>
          <p className='text-label_md'>
            <span className='text-primary-400'>댓글을 남기며 추억</span>
            <span className='text-gray-900'>을 나눠봐요!</span>
          </p>
        </div>
        <div className='relative flex w-full max-w-[400px] justify-center rounded-xl shadow-BG_Broad'>
          <Image
            src={image6}
            alt='그룹 지도 예시 사진'
            sizes='400px'
            style={{
              width: '343px',
              height: 'auto',
              borderRadius: '12px',
            }}
          />
        </div>
        <LinkButton
          href='/login'
          label='로그인하여 시작'
          size='full'
        />
      </section>
    </div>
  );
};

export default ScrollSections;
