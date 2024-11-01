'use client';

import Modal from '../_common/Modal';
import SubmitInviteForm from './SubmitInviteForm';
import { useIsOpen } from '@/hooks/byUse/useIsOpen';
import { useRouter } from 'next/navigation';

const GroupAddButton = () => {
  const [isBottomSheetOpen, handleBottomSheetOpen] = useIsOpen();
  const router = useRouter();
  return (
    <div className='flex flex-row gap-[17px] mx-4'>
      <Modal
        isModalOpen={isBottomSheetOpen}
        handleModalOpen={handleBottomSheetOpen}
      >
        <SubmitInviteForm
          isBottomSheetOpen={isBottomSheetOpen}
          handleBottomSheetOpen={handleBottomSheetOpen}
        />
      </Modal>
      <button
        className='bg-white text-black border border-solid border-black p-[10px] w-[160px] h-[56px]'
        onClick={handleBottomSheetOpen}
      >
        초대 코드 입력하기
      </button>
      <button
        className='bg-black text-white p-[10px] w-[160px] h-[56px]'
        onClick={() => router.push('/makegroup')}
      >
        + 그룹 생성하기
      </button>
    </div>
  );
};

export default GroupAddButton;
