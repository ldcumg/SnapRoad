'use client';

import { IconDots } from '@/lib/icon/Icon_ Dots';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const router = useRouter();
  const { groupId, lat, lng, addressName: place } = usePostDataStore();

  const handlePosts = () => {
    router.push(`/group/${groupId}/post?lat=${lat}&lng=${lng}&place=${place}`);
  };

  return (
    <div
      className='relative flex w-full justify-end'
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className='text-gray-500 focus:outline-none'
      >
        <IconDots />
      </button>

      {isOpen && (
        <div className='absolute right-0 top-5 z-10 mt-2 w-32 rounded-lg border bg-white p-2 shadow-lg'>
          <button
            className='block w-full bg-white px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
            onClick={handlePosts}
          >
            게시물 수정
          </button>
          <button
            className='block w-full bg-white px-4 py-2 text-left text-red-500 hover:bg-red-100'
            onClick={() => alert('게시물 삭제')}
          >
            게시물 삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
