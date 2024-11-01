import { Button } from './Button';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Ui/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],

  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    label: '기본 버튼',
  },
};

export const Secondary: Story = {
  args: {
    type: 'button',
    variant: 'secondary',
    label: '보조 버튼',
  },
};

export const OutlinePink: Story = {
  args: {
    type: 'button',
    variant: 'outlinePink',
    label: '테두리 보조 버튼',
  },
};

export const OutlineGray: Story = {
  args: {
    type: 'button',
    variant: 'outlineGray',
    label: '테두리 회색 버튼',
  },
};

export const Large: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    size: 'large',
    label: '큰 기본 버튼',
  },
};

export const Medium: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    size: 'medium',
    label: '기본 버튼',
  },
};

export const Small: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    size: 'small',
    label: '작은 기본 버튼',
  },
};

export const DisabledPrimary: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    label: '비활성화 기본 버튼',
    disabled: true,
  },
};

export const DisabledSecondary: Story = {
  args: {
    type: 'button',
    variant: 'secondary',
    label: '비활성화 보조 버튼',
    disabled: true,
  },
};

export const LoadingPrimary: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    label: '로딩 중...',
    loading: true,
  },
};

export const LoadingSecondary: Story = {
  args: {
    type: 'button',
    variant: 'secondary',
    label: '로딩 중...',
    loading: true,
  },
};
