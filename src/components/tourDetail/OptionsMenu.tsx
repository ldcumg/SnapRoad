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
    <div
      className='relative flex'
      ref={menuRef}
    >
      <button onClick={toggleMenu}>
        <Image
          src={'/svgs/Dots.svg'}
          alt='더보기'
          width={20}
          height={20}
        />
      </button>
      {isVisible && (
        <div className='flex flex-col absolute border border-black bg-white z-10 top-5 right-1 w-20'>
          <button className='border-b border-black'>수정하기</button>
          <button
            onClick={() => deletePost(postId)}
            className='text-red-600'
          >
            삭제하기
          </button>
        </div>
      )}
    </div>
  );
};

export default OptionsMenu;
