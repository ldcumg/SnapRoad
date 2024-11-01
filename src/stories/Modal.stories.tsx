import { Modal } from './Modal';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Modal> = {
  title: 'Ui/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: {
    // onChange: (e) => console.log(e.target.value),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
