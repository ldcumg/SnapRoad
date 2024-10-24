const GroupItemSkeleton = () => {
  return (
    <ul className='grid grid-cols-2 gap-[15px]'>
      {['a', 'b', 'c', 'd', 'e', 'f'].map((el, idx) => {
        return (
          <li
            key={`${el}-${idx}`}
            className='flex flex-col gap-[10px] p-[16px] bg-[#DEDEDE] w-[164px] h-[273px]'
          >
            <div className='h-[132px] bg-[#bebebe]'></div>
            <div className='h-[17px] bg-[#bebebe]'></div>
            <div className='h-[17px] bg-[#bebebe]'></div>
          </li>
        );
      })}
    </ul>
  );
};

export default GroupItemSkeleton;
