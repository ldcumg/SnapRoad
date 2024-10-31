import { Tab } from './Tab';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Example/Tab',
  component: Tab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    tabs: [
      {
        label: '탭 1',
        content: <div>탭 1 내용</div>,
      },
      {
        label: '탭 2',
        content: <div>탭 2 내용</div>,
      },
      {
        label: '탭 3',
        content: <div>탭 3 내용</div>,
      },
      {
        label: '탭 4',
        content: <div>탭 4 내용</div>,
      },
      {
        label: '탭 5',
        content: <div>탭 5 내용</div>,
      },
    ],
  },
};

export const FullScreen: Story = {
  args: {
    variant: 'full',
    size: 'medium',
    tabs: [
      {
        label: '탭 A',
        content: <div>탭 A 내용</div>,
      },
      {
        label: '탭 B',
        content: <div>탭 B 내용</div>,
      },
      {
        label: '탭 C',
        content: <div>탭 C 내용</div>,
      },
    ],
  },
};

export const SmallTabs: Story = {
  args: {
    size: 'small',
    tabs: [
      {
        label: '작은 탭 1',
        content: <div>작은 탭 1 내용</div>,
      },
      {
        label: '작은 탭 2',
        content: <div>작은 탭 2 내용</div>,
      },
    ],
  },
};

export const LargeTabs: Story = {
  args: {
    size: 'large',
    tabs: [
      {
        label: '큰 탭 1',
        content: <div>큰 탭 1 내용</div>,
      },
      {
        label: '큰 탭 2',
        content: <div>큰 탭 2 내용</div>,
      },
    ],
  },
};
