'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MakeGroupHeader = () => {
  const router = useRouter();
  return (
    <div className='flex flex-row justify-between px-4 py-2'>
      <Link
        href={'/grouplist'}
        className='flex items-center justify-center'
      >
        <img
          src='/svgs/Logo.svg'
          alt='로고'
        />
      </Link>
      <button
        onClick={() => router.back()}
        className='flex items-center justify-center'
      >
        <img
          src='/svgs/Close_LG.svg'
          alt='닫기'
          className='h-6 w-6 rounded-[20px]'
        />
      </button>
    </div>
  );
};

export default MakeGroupHeader;
