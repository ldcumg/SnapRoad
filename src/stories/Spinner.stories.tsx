import Spinner from './Spinner';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary_50: Story = { args: { color: 'primary-50' } };
export const Primary_200: Story = { args: { color: 'primary-200' } };
export const Primary_400: Story = { args: { color: 'primary-400' } };
export const Primary_600: Story = { args: { color: 'primary-600' } };
export const Secondary_50: Story = { args: { color: 'secondary-50' } };
export const Secondary_100: Story = { args: { color: 'secondary-100' } };
export const Secondary_400: Story = { args: { color: 'secondary-400' } };
export const Secondary_600: Story = { args: { color: 'secondary-600' } };
export const Gray_50: Story = { args: { color: 'gray-50' } };
export const Gray_100: Story = { args: { color: 'gray-100' } };
export const Gray_200: Story = { args: { color: 'gray-200' } };
export const Gray_300: Story = { args: { color: 'gray-300' } };
export const Gray_400: Story = { args: { color: 'gray-400' } };
export const Gray_500: Story = { args: { color: 'gray-500' } };
export const Gray_600: Story = { args: { color: 'gray-600' } };
export const Gray_700: Story = { args: { color: 'gray-700' } };
export const Gray_800: Story = { args: { color: 'gray-800' } };
export const Gray_900: Story = { args: { color: 'gray-900' } };
