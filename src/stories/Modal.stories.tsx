import { Modal } from './Modal';
import { ModalContent } from './ModalContentProps';
import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => setIsModalOpen(!isModalOpen);

    return (
      <div className='p-4 flex flex-col items-center'>
        <button
          onClick={handleModalOpen}
          className='px-4 py-2 bg-primary-400 text-white rounded hover:bg-primary-500 transition'
        >
          Open Modal
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
    );
  },
};
