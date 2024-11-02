import Link from 'next/link';

const MakeGroupHeader = async () => {
  return (
    <div className='py-2 px-4 flex flex-row justify-between'>
      <Link
        href={'/grouplist'}
        className='flex justify-center items-center'
      >
        <img
          src='/svgs/Logo.svg'
          alt='로고'
        />
      </Link>
      <Link
        href='/grouplist'
        className='flex justify-center items-center'
      >
        <img
          src='/svgs/Close_LG.svg'
          alt='닫기'
          className='rounded-[20px] w-6 h-6'
        />
      </Link>
    </div>
  );
};

export default MakeGroupHeader;
