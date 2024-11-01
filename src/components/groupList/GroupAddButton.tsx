'use client';

import Modal from '../_common/Modal';
import SubmitInviteForm from './SubmitInviteForm';
import { useIsOpen } from '@/hooks/byUse/useIsOpen';
import { Button } from '@/stories/Button';
import { useRouter } from 'next/navigation';

const GroupAddButton = () => {
  const [isBottomSheetOpen, handleBottomSheetOpen] = useIsOpen();
  const router = useRouter();
  return (
    <div className='flex flex-row w-full justify-between gap-4 px-4 py-5'>
      <Modal
        isModalOpen={isBottomSheetOpen}
        handleModalOpen={handleBottomSheetOpen}
      >
        <SubmitInviteForm
          isBottomSheetOpen={isBottomSheetOpen}
          handleBottomSheetOpen={handleBottomSheetOpen}
        />
      </Modal>
      <Button
        label='초대코드 입력'
        variant='outlineGray'
        onClick={handleBottomSheetOpen}
      >
        <img
          src='/svgs/User_Group.svg'
          alt=''
        />
      </Button>
      <Button
        label='그룹 생성하기'
        onClick={() => router.push('/makegroup')}
      >
        <img
          src='/svgs/Plus_LG.svg'
          alt=''
        />
      </Button>
    </div>
  );
};

export default GroupAddButton;
