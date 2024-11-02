import { Modal } from '@/stories/Modal';
import { ModalContent } from '@/stories/ModalContentProps';
import { useState } from 'react';

const Modals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-8'>모달</h1>
      <div className='p-4 flex flex-col items-center'>
        <button
          onClick={handleModalOpen}
          className='mt-4 px-4 py-2 bg-primary-400 text-white rounded hover:bg-primary-600 rounded-md transition'
        >
          모달 열기
        </button>

        <Modal
          isModalOpen={isModalOpen}
          handleModalOpen={handleModalOpen}
        >
          <ModalContent
            title='모달 타이틀'
            content='Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex iste inventore rem sunt vel at, odio, nam eligendi itaque, molestias mollitia delectus culpa possimus accusantium voluptatibus ab in! Amet, minima!'
            onClose={handleModalOpen}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Modals;
