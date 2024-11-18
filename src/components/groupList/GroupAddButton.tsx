'use client';

import MakeGroupForm from '../makegroup/MakeGroupForm';
import SubmitInviteForm from './SubmitInviteForm';
import { useIsOpen } from '@/hooks/byUse/useIsOpen';
import useMediaQuery from '@/hooks/byUse/useMediaQuery';
import { Button } from '@/stories/Button';
import { LinkButton } from '@/stories/LinkButton';
import { Modal } from '@/stories/Modal';
import { useEffect, useState } from 'react';

type Props = {
  dataLen?: number;
};

type AddButtonsProps = {
  isDesktop: boolean;
  handleBottomSheetOpen: () => void;
};

const AddButtons = ({ handleBottomSheetOpen, isDesktop }: AddButtonsProps) => {
  console.log('isDesktop :>> ', isDesktop);
  return (
    <>
      {isDesktop ? (
        <SubmitInviteForm isDesktop={isDesktop} />
      ) : (
        <Button
          label='초대코드 입력'
          onClick={handleBottomSheetOpen}
          size='full'
          className='text-title_lg text-gray-700'
          variant='outlineGray'
        >
          <img
            src='/svgs/User_Group.svg'
            alt=''
          />
        </Button>
      )}
      {isDesktop ? (
        <Button
          label='그룹만들기'
          size='large'
          className='px-7 py-4 text-white'
          onClick={handleBottomSheetOpen}
        >
          <img
            src='/svgs/Plus_LG.svg'
            alt=''
          />
        </Button>
      ) : (
        <LinkButton
          label='그룹만들기'
          href='/makegroup'
          size='full'
          className='text-white'
        >
          <img
            src='/svgs/Plus_LG.svg'
            alt=''
          />
        </LinkButton>
      )}
    </>
  );
};

const GroupAddButton = ({ dataLen }: Props) => {
  const [isBottomSheetOpen, handleBottomSheetOpen] = useIsOpen();
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    setDesktop(isDesktop);
  }, [isDesktop]);
  return (
    <>
      {dataLen ? (
        <div className='flex w-full flex-row justify-between gap-4 px-4 py-5'>
          <Modal
            isModalOpen={isBottomSheetOpen}
            handleModalOpen={handleBottomSheetOpen}
            title={desktop ? '그룹 생성' : undefined}
          >
            {desktop ? <MakeGroupForm handleUpdateModal={handleBottomSheetOpen} /> : <SubmitInviteForm />}
          </Modal>
          <AddButtons
            isDesktop={desktop}
            handleBottomSheetOpen={handleBottomSheetOpen}
          />
        </div>
      ) : (
        <div className='my-[186px] flex w-full flex-col justify-center gap-4'>
          <Modal
            isModalOpen={isBottomSheetOpen}
            handleModalOpen={handleBottomSheetOpen}
          >
            {desktop ? <MakeGroupForm /> : <SubmitInviteForm />}
          </Modal>
          <p className='w-full text-center text-title_xl text-gray-500'>그룹을 만들어 추억을 남겨보세요!</p>
          <div className='flex flex-col gap-2 px-4 py-5'>
            <AddButtons
              isDesktop={desktop}
              handleBottomSheetOpen={handleBottomSheetOpen}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GroupAddButton;
