'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptionsMenuProps {
  id: string;
  handleDelete: (id: string) => void;
}

const OptionsMenu = ({ id, handleDelete }: OptionsMenuProps) => {
  console.log('지우는 곳 까지 들어왔는데');
  console.log('id :>> ', id);

  const [isVisible, setIsVisible] = useState(false);

  const toggleMenu = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className='relative flex'>
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
            onClick={() => handleDelete(id)}
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
