'use client';

// import Modal from '../_common/Modal';
import SubmitInviteForm from './SubmitInviteForm';
import { useIsOpen } from '@/hooks/byUse/useIsOpen';
import { Button } from '@/stories/Button';
import { Modal } from '@/stories/Modal';
import { useRouter } from 'next/navigation';

type Props = {
  dataLen?: number;
};

const GroupAddButton = ({ dataLen }: Props) => {
  const [isBottomSheetOpen, handleBottomSheetOpen] = useIsOpen();
  const router = useRouter();
  return (
    <>
      {dataLen ? (
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
      ) : (
        <div className='flex flex-col justify-center gap-4 w-full my-[186px]'>
          <Modal
            isModalOpen={isBottomSheetOpen}
            handleModalOpen={handleBottomSheetOpen}
          >
            <SubmitInviteForm
              isBottomSheetOpen={isBottomSheetOpen}
              handleBottomSheetOpen={handleBottomSheetOpen}
            />
          </Modal>
          <p className='text-title_xl text-gray-500 w-full text-center'>그룹을 만들어 추억을 남겨보세요!</p>
          <div className='px-4 py-5 flex flex-col gap-2'>
            <Button
              label='그룹만들기'
              onClick={() => router.push('/makegroup')}
              size='large'
              className='text-tile_lg text-white'
            >
              <img
                src='/svgs/Plus_LG.svg'
                alt=''
              />
            </Button>
            <Button
              label='초대코드 입력'
              onClick={handleBottomSheetOpen}
              size='large'
              className='text-tile_lg text-gray-700'
              variant='outlineGray'
            >
              <img
                src='/svgs/User_Group.svg'
                alt=''
              />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupAddButton;
