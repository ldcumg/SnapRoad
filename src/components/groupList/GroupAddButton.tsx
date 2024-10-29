'use client';

import SubmitInviteForm from './SubmitInviteForm';
import { useIsOpen } from '@/hooks/byUse/useIsOpen';
import { useRouter } from 'next/navigation';

const GroupAddButton = () => {
  const [isAccordionOpen, handleAccordionOpen] = useIsOpen();
  const [isBottomSheetOpen, handleBottomSheetOpen] = useIsOpen();
  const router = useRouter();
  return (
    <div className='fixed bottom-0 '>
      <SubmitInviteForm
        isBottomSheetOpen={isBottomSheetOpen}
        handleBottomSheetOpen={handleBottomSheetOpen}
      />
      <div className={`${isAccordionOpen ? 'flex' : 'hidden'} flex-col justify-center items-center`}>
        <button
          className='border border-solid border-black p-[10px] w-screen'
          onClick={handleBottomSheetOpen}
        >
          초대 코드 입력하기
        </button>
        <button
          className='border border-solid border-black p-[10px] w-screen'
          onClick={() => router.push('/makegroup')}
        >
          새로운 그룹 생성하기
        </button>
      </div>
      <button
        onClick={handleAccordionOpen}
        className='border border-solid border-black p-[10px] w-screen z-10'
      >
        그룹 추가하기
      </button>
    </div>
  );
};

export default GroupAddButton;
