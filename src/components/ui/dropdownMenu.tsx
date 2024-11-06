'use client';

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
      className='relative w-full flex justify-end'
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className='text-gray-500 focus:outline-none'
      >
        <img
          src={'/svgs/Dots.svg'}
          alt='게시물 수정 삭제'
          width={24}
          height={24}
        />
      </button>

      {isOpen && (
        <div className='absolute top-5 right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg p-2 z-10'>
          <button
            className='block w-full text-left px-4 py-2 bg-white text-gray-700 hover:bg-gray-100'
            onClick={handlePosts}
          >
            게시물 수정
          </button>
          <button
            className='block w-full text-left px-4 py-2 bg-white text-red-500 hover:bg-red-100'
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
