const RandomImageSkeleton = () => {
  return (
    <div className='rounded-xl w-full flex justify-center items-center'>
      <div className='relative rounded-xl w-[220px] h-[220px] bg-[#ececec]'>
        <div className='absolute inset-0 bg-gradient-to-b from-white to-black opacity-50 rounded-xl'></div>
      </div>
    </div>
  );
};

export default RandomImageSkeleton;
