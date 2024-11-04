const GroupItemSkeleton = () => {
  return (
    <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
      {['a', 'b', 'c', 'd', 'e', 'f'].map((el, idx) => {
        return (
          <li
            key={`${el}-${idx}`}
            className='flex flex-col items-center p-4 min-h-[244px] max-h-[300px] bg-white gap-2 cursor-pointer rounded-xl border border-solid border-gray-100'
          >
            <div className='w-[130px] h-[130px] bg-gray-200 animate-pulse' />
            <div className='flex flex-col items-center w-full gap-2'>
              <div className='flex flex-row'>
                <div className='w-[130px] h-[20px] bg-gray-200 animate-pulse' />
              </div>
              <div className='w-[130px] h-[60px] bg-gray-200 animate-pulse line-clamp-3' />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default GroupItemSkeleton;
