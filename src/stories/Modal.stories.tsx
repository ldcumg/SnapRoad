import { Button } from './Button';
import { Modal } from './Modal';
import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultModal: Story = {
  render: () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
      setIsModalOpen(!isModalOpen);
    };

    return (
      <div className='flex flex-col items-center space-y-4'>
        <button
          onClick={handleModalOpen}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
        >
          모달 열기
        </button>

        <Modal
          isModalOpen={isModalOpen}
          handleModalOpen={handleModalOpen}
        >
          <div>
            <h2 className='text-lg font-semibold mb-2'>모달 타이틀</h2>
            <p className='text-gray-700 mb-4'>모달 내부의 컨텐츠입니다.</p>
            <Button
              type='button'
              variant='primary'
              label='닫기'
              onClick={handleModalOpen}
            />
          </div>
        </Modal>
      </div>
    );
  },
};
