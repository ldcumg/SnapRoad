'use client';

import { BottomSheet } from '@/stories/BottomSheet';

type Props = Readonly<{
  desktop: boolean;
  children: React.ReactNode;
  handleFindUserLocation: () => void;
}>;

const SearchResultLayout = ({ desktop, children, handleFindUserLocation }: Props) => {
  if (desktop) {
    return (
      <div className='shadow-[0px 0px 12px 0px rgba(0, 0, 0, 0.30)] fixed bottom-[28px] left-1/2 z-30 flex w-[628px] -translate-x-1/2 items-center rounded-[28px] bg-white p-[40px] pb-[116px]'>
        {children}
      </div>
    );
  }

  return (
    <BottomSheet
      height='custom'
      customHeight=''
      rounded={true}
      isOpen={true}
      showHeader={false}
      hasButton={false}
      className='mb-0 pb-2 pt-7'
      backdrop={false}
    >
      <button
        className='absolute -top-[16px] left-[16px] z-50 h-[44px] w-[44px] -translate-y-[90%] rounded-full bg-white'
        onClick={handleFindUserLocation}
      >
        <img
          className='mx-auto my-auto'
          src='/svgs/Geolocation_btn.svg'
        />
      </button>
      {children}
    </BottomSheet>
  );
};

export default SearchResultLayout;