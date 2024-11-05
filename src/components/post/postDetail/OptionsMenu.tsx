'use client';

import { useDeletePost } from '@/hooks/queries/byUse/usePostMutation';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/** 상단 옵션 정보 */
const OptionsMenu = ({ postId }: { postId: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { mutate: deletePost } = useDeletePost();

  const toggleMenu = () => {
    setIsVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className='relative flex'
        ref={menuRef}
      >
        <img
          src='/svgs/Dots.svg'
          alt='더보기'
          onClick={toggleMenu}
          className='cursor-pointer'
        />

        {isVisible && (
          <div className='flex flex-col absolute bg-white z-10 top-5 right-1 rounded-md'>
            <button className='text-gray-900 text-body_md p-2.5 whitespace-nowrap'>게시물 수정</button>
            <button
              onClick={() => deletePost(postId)}
              className='text-danger text-body_md p-2.5'
            >
              게시물 삭제
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default OptionsMenu;