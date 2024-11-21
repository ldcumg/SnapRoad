import { DotSpinner } from '@/stories/DotSpinner';

const PostLoadingSpinner = () => {
  return (
    <div className='mt-40 flex h-full w-full items-center justify-center'>
      <section className='flex flex-col items-center gap-[23px]'>
        <DotSpinner />
        <p className='text-label_md text-gray-700'>이미지 업로드 중입니다...</p>
      </section>
    </div>
  );
};

export default PostLoadingSpinner;
