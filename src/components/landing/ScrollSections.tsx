'use client';

import { useEffect, useRef } from 'react';

const ScrollSections = () => {
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);
  const section3Ref = useRef<HTMLElement>(null);
  const sections = [section1Ref, section2Ref, section3Ref];

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
        className='h-screen pt-14 bg-red-100'
      ></section>
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
