import DotSpinner from '@/components/_common/DotSpinner';

const page = () => {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <section className='flex flex-col items-center gap-[23px]'>
        <DotSpinner />
        <p className='text-label_md text-gray-700'>잠시만 기다려주세요...</p>
      </section>
    </div>
  );
};

export default page;
