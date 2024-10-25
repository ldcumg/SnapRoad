import Link from 'next/link';

const GroupListHeader = () => {
  return (
    <div className='bg-slate-400 flex flex-row justify-between px-[10px] py-[5px]'>
      <div>Logo</div>
      <Link href={'/mypage'}>
        <img
          src=''
          alt='유저이미지'
        />
      </Link>
    </div>
  );
};

export default GroupListHeader;
