import { TopButton } from './TopButton';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/TopButton',
  component: TopButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TopButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
