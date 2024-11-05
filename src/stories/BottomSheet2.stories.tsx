import { BottomSheet2 } from './BottomSheet2';
import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/BottomSheet2',
  component: BottomSheet2,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClose: action('onClose'),
    onButtonClick: action('onButtonClick'),
    title: 'Sample Title',
    buttonLabel: 'Confirm',
    isOpen: true,
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Bottom sheet title',
    },
    buttonLabel: {
      control: 'text',
      description: 'Label for the action button',
    },
    isOpen: {
      control: 'boolean',
      description: 'Controls if the bottom sheet is open',
    },
  },
} satisfies Meta<typeof BottomSheet2>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div>Here is the content inside the bottom sheet.</div>,
  },
};

export const OpenBottomSheet: Story = {
  args: {
    isOpen: true, // 열림 상태로 변경
    title: 'Open Bottom Sheet',
    buttonLabel: 'Proceed',
    children: (
      <div className='h-2/4!'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum ab exercitationem sint assumenda voluptas quia
        optio eos aliquid magnam iure? Soluta iste voluptatum excepturi recusandae! Neque voluptates dolorum et vel.
      </div>
    ),
  },
};

export const ClosedBottomSheet: Story = {
  args: {
    isOpen: false,
    title: 'Closed Bottom Sheet',
    buttonLabel: 'Done',
    children: <div>The bottom sheet is currently closed.</div>,
  },
};
