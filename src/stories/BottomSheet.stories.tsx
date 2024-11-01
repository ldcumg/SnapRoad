import { BottomSheet } from './BottomSheet';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

const meta = {
  title: 'Ui/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClose: fn() },
  argTypes: {
    isOpen: { control: 'boolean', description: '바텀시트가 열려 있는지 여부' },
    title: { control: 'text', description: '바텀시트 제목' },
    buttonLabel: { control: 'text', description: '하단 버튼의 텍스트' },
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HalfHeight: Story = {
  args: {
    isOpen: true,
    title: '반 높이 바텀시트',
    buttonLabel: '확인',
    onButtonClick: fn(),
    height: 'half',
    children: <p>50% 높이의 바텀시트 내용입니다.</p>,
  },
};

export const FullHeight: Story = {
  args: {
    isOpen: true,
    title: '전체 높이 바텀시트',
    buttonLabel: '확인',
    onButtonClick: fn(),
    height: 'full',
    children: <p>100% 높이의 바텀시트 내용입니다.</p>,
  },
};

export const HalfHeightWithBack: Story = {
  args: {
    isOpen: true,
    title: ' 반 높이 뒤로가기 버튼 포함 바텀시트',
    buttonLabel: '확인',
    onButtonClick: fn(),
    onBack: fn(), // 뒤로가기 버튼 동작 추가
    height: 'half',
    children: <p>50% 높이의 뒤로가기 버튼이 있는 바텀시트입니다.</p>,
  },
};

export const FullHeightWithBack: Story = {
  args: {
    isOpen: true,
    title: '전체 높이 뒤로가기 버튼 포함 바텀시트',
    buttonLabel: '확인',
    onButtonClick: fn(),
    onBack: fn(), // 뒤로가기 버튼 동작 추가
    height: 'full',
    children: <p>100% 높이의 뒤로가기 버튼이 있는 바텀시트입니다.</p>,
  },
};
