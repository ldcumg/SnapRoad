'use client';

const TopButton = () => {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='fixed bottom-4 right-4 p-2 rounded-[20px] bg-secondary-50 shadow-BG_TopButton'
    >
      <img
        src='/svgs/Arrow_UP_MD.svg'
        alt=''
      />
    </button>
  );
};

export default TopButton;
