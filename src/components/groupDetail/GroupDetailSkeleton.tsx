'use client';

const GroupDetailSkeleton = ({ desktop }: { desktop: boolean }) => {
  const CELL_COUNT = desktop ? 20 : 15;
  return (
    <>
      <div className='px-[16px] pc:flex pc:justify-center pc:border-b'>
        <div className='flex flex-row gap-[16px] border-b py-[24px] pc:mb-[20px] pc:mt-[40px] pc:w-[582px] pc:gap-[20px] pc:border-b-0'>
          <div className='h-[132px] min-h-[132px] w-[132px] min-w-[132px] animate-pulse bg-gray-200 pc:h-[220px] pc:min-h-[220px] pc:w-[220px] pc:min-w-[220px]'></div>
          <div className='flex w-full flex-col gap-[12px]'>
            <div className='flex flex-row items-center justify-between'>
              <div className='flex h-[32px] w-[53px] animate-pulse flex-row gap-[4px] rounded-[12px] border border-gray-100 bg-gray-200'></div>
              <div className='h-[24px] w-[24px] animate-pulse rounded-full bg-gray-200'></div>
            </div>
            <span className='h-[12px] w-full animate-pulse bg-gray-200 pc:h-[14px]'></span>
            <span className='h-[12px] w-full animate-pulse bg-gray-200 pc:h-[14px]'></span>
            <span className='h-[12px] w-full animate-pulse bg-gray-200 pc:h-[14px]'></span>
          </div>
        </div>
      </div>
      <ul className='mx-auto grid grid-cols-3 gap-[4px] py-[15px] pc:grid-cols-5 pc:gap-[8px] pc:py-[40px]'>
        {[...Array(CELL_COUNT)].map((_, index) => (
          <li
            className='h-[112px] w-[112px] animate-pulse rounded-[8px] bg-gray-200 pc:h-[232px] pc:w-[232px] pc:rounded-[12px]'
            key={index}
          ></li>
        ))}
      </ul>
    </>
  );
};

export default GroupDetailSkeleton;
