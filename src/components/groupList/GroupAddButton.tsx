'use client';

import SubmitInviteForm from './SubmitInviteForm';
import { useIsOpen } from '@/hooks/byUse/useIsOpen';
import { Button } from '@/stories/Button';
import { LinkButton } from '@/stories/LinkButton';
import { Modal } from '@/stories/Modal';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  dataLen?: number;
};

type AddButtonsProps = {
  router: AppRouterInstance;
  handleBottomSheetOpen: () => void;
};

const AddButtons = ({ router, handleBottomSheetOpen }: AddButtonsProps) => {
  return (
    <>
      <Button
        label='초대코드 입력'
        onClick={handleBottomSheetOpen}
        size='full'
        className='text-tile_lg text-gray-700'
        variant='outlineGray'
      >
        <img
          src='/svgs/User_Group.svg'
          alt=''
        />
      </Button>
      <LinkButton
        label='그룹만들기'
        href='/makegroup'
        size='full'
        className='text-tile_lg text-white'
      >
        <img
          src='/svgs/Plus_LG.svg'
          alt=''
        />
      </LinkButton>
    </>
  );
};

const GroupAddButton = ({ dataLen }: Props) => {
  const [isBottomSheetOpen, handleBottomSheetOpen] = useIsOpen();
  const router = useRouter();
  return (
    <>
      {dataLen ? (
        <div className='flex w-full flex-row justify-between gap-4 px-4 py-5'>
          <Modal
            isModalOpen={isBottomSheetOpen}
            handleModalOpen={handleBottomSheetOpen}
          >
            <SubmitInviteForm
              isBottomSheetOpen={isBottomSheetOpen}
              handleBottomSheetOpen={handleBottomSheetOpen}
            />
          </Modal>
          <AddButtons
            router={router}
            handleBottomSheetOpen={handleBottomSheetOpen}
          />
        </div>
      ) : (
        <div className='my-[186px] flex w-full flex-col justify-center gap-4'>
          <Modal
            isModalOpen={isBottomSheetOpen}
            handleModalOpen={handleBottomSheetOpen}
          >
            <SubmitInviteForm
              isBottomSheetOpen={isBottomSheetOpen}
              handleBottomSheetOpen={handleBottomSheetOpen}
            />
          </Modal>
          <p className='w-full text-center text-title_xl text-gray-500'>그룹을 만들어 추억을 남겨보세요!</p>
          <div className='flex flex-col gap-2 px-4 py-5'>
            <AddButtons
              router={router}
              handleBottomSheetOpen={handleBottomSheetOpen}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GroupAddButton;
