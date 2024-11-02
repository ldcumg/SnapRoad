import { Input } from './Input';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: {
    onChange: (e) => console.log(e.target.value),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '라벨',
    placeholder: '플레이스 홀더',
  },
};

export const WithHelperText: Story = {
  args: {
    label: '비밀번호',
    placeholder: '비밀번호를 입력하세요',
    helperText: '8자 이상 작성하세요',
  },
};

export const WithDeleteButton: Story = {
  args: {
    label: '삭제 가능한 입력',
    placeholder: '텍스트를 입력하세요',
    helperText: '이 입력 필드에는 삭제 버튼이 있습니다.',
    onDeleteClick: () => console.log('삭제 버튼 클릭됨'),
  },
};

export const Disabled: Story = {
  args: {
    label: '라벨',
    placeholder: '입력 불가',
    disabled: true,
    helperText: '이것은 입력 불가 입력 필드입니다',
  },
};

export const Large: Story = {
  args: {
    label: '라벨',
    placeholder: '플레이스 홀더',
    size: 'large',
    helperText: '이것은 큰 입력 필드입니다',
  },
};

export const Medium: Story = {
  args: {
    label: '라벨',
    placeholder: '플레이스 홀더',
    size: 'medium',
    helperText: '이것은 중간 크기의 입력 필드입니다',
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary 입력',
    placeholder: 'Primary 스타일',
    variant: 'primary',
    helperText: 'Primary 색상 스타일입니다.',
  },
};

export const Danger: Story = {
  args: {
    label: 'Danger 입력',
    placeholder: '경고 스타일',
    variant: 'danger',
    helperText: '경고 색상 스타일입니다.',
  },
};

export const OutlinePink: Story = {
  args: {
    label: 'Outline Pink 입력',
    placeholder: '분홍색 테두리 스타일',
    variant: 'outlinePink',
    helperText: '분홍색 테두리 스타일입니다.',
  },
};

export const OutlineGray: Story = {
  args: {
    label: 'Outline Gray 입력',
    placeholder: '회색 테두리 스타일',
    variant: 'outlineGray',
    helperText: '회색 테두리 스타일입니다.',
  },
};

export const DefaultVariant: Story = {
  args: {
    label: 'Default 입력',
    placeholder: '기본 스타일',
    variant: 'default',
    helperText: '기본 색상 스타일입니다.',
  },
};

export const PasswordInput: Story = {
  args: {
    label: '비밀번호',
    type: 'password',
    placeholder: '비밀번호를 입력하세요',
    helperText: '비밀번호를 입력하고 보기 버튼을 눌러 확인하세요',
  },
};
