import { DotSpinner } from '@/stories/DotSpinner';

const Loading = () => {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <section className='flex flex-col items-center gap-[23px]'>
        <DotSpinner />
        <p className='text-label_md text-gray-700'>페이지 로딩중 입니다...</p>
      </section>
    </div>
  );
};

export default Loading;
