import { Button } from '@/stories/Button';
import { Modal } from '@/stories/Modal';
import { useState } from 'react';

const Modals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-8'>모달</h1>
      <div className='flex flex-col items-center'>
        <Button
          type='button'
          variant='primary'
          size='large'
          label='모달 열기'
          onClick={handleModalOpen}
          className='transition'
        />

        <Modal
          isModalOpen={isModalOpen}
          handleModalOpen={handleModalOpen}
        >
          <div className='p-4 bg-white max-w-md w-full'>
            <h2 className='text-lg font-semibold mb-2'>모달 타이틀</h2>
            <p className='text-gray-700 mb-4'>모달 내부의 컨텐츠입니다.</p>
            <Button
              type='button'
              variant='primary'
              size='large'
              label='닫기'
              onClick={handleModalOpen}
              className='transition w-full'
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Modals;
