'use client';

import { useDeletePost } from '@/hooks/queries/byUse/usePostMutation';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const OptionsMenu = ({ postId }: { postId: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { groupId, lat, lng, addressName: place } = usePostDataStore();

  const { mutate: deletePost } = useDeletePost(groupId!);

  const toggleMenu = () => {
    setIsVisible((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePosts = () => {
    router.push(`/group/${groupId}/post/${postId}/edit?lat=${lat}&lng=${lng}`);
  };

  const handleDeletePost = (postId: string) => {
    const isConfirmed = confirm('게시물을 삭제하시겠습니까?');
    if (isConfirmed) {
      deletePost(postId);
      router.push(`/group/${groupId}`);
    }
  };

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
          <div className='absolute right-1 top-5 z-10 flex flex-col rounded-md bg-white'>
            <button
              className='whitespace-nowrap p-2.5 text-body_md text-gray-900'
              onClick={handlePosts}
            >
              게시물 수정
            </button>
            <button
              onClick={() => handleDeletePost(postId)}
              className='whitespace-nowrap p-2.5 text-body_md text-danger'
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
