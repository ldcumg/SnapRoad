'use client';

const TopButton = () => {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='fixed bottom-4 right-4 rounded-[20px] bg-secondary-50 p-2 shadow-BG_TopButton'
    >
      <img
        src='/svgs/Arrow_Up_MD.svg'
        alt=''
      />
    </button>
  );
};

export default TopButton;
