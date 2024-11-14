import { DotSpinner } from './DotSpinner';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/DotSpinner',
  component: DotSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DotSpinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
