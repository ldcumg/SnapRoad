import { Palette } from './Palette';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/Palette',
  component: Palette,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Palette>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
