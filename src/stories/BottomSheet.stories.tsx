import { BottomSheet } from './BottomSheet';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

const meta = {
  title: 'UI/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClose: fn(),
    onConfirm: fn(),
    oncancelButtonClick: fn(),
    onconfirmButtonClick: fn(),
    showHeader: true,
    showBackButton: true,
    showCloseButton: true,
  },
  argTypes: {
    isOpen: { control: 'boolean', description: '바텀시트가 열려 있는지 여부' },
    onClose: { action: 'onClose', description: '닫기 버튼 클릭 시 호출되는 함수' },
    onConfirm: { action: 'onConfirm', description: '확인 버튼 클릭 시 호출되는 함수' },
    oncancelButtonClick: { action: 'oncancelButtonClick', description: '취소 버튼 클릭 시 호출되는 함수' },
    onconfirmButtonClick: { action: 'onconfirmButtonClick', description: '확인 버튼 클릭 시 호출되는 함수' },
    title: { control: 'text', description: '바텀시트 제목' },
    confirmLabel: { control: 'text', description: '확인 버튼의 텍스트' },
    cancelLabel: { control: 'text', description: '취소 버튼의 텍스트' },
    height: { control: 'select', options: ['full', 'half', 'custom'], description: '바텀시트 높이' },
    customHeight: { control: 'text', description: '커스텀 높이를 설정할 수 있는 옵션' },
    rounded: { control: 'boolean', description: '바텀시트 상단 모서리 라운드 여부' },
    border: { control: 'boolean', description: '바텀시트 상단에 보더 표시 여부' },
    hideTitle: { control: 'boolean', description: '바텀시트 타이틀 숨김 여부' },
    singleButton: { control: 'boolean', description: '단일 버튼 표시 여부' },
    showHeader: { control: 'boolean', description: '상단 헤더 표시 여부' },
    showBackButton: { control: 'boolean', description: '뒤로가기 버튼 표시 여부' },
    showCloseButton: { control: 'boolean', description: '닫기 버튼 표시 여부' },
    children: { control: 'text', description: '바텀시트 내부에 렌더링되는 콘텐츠' },
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// 각 스토리 정의
export const HalfHeight: Story = {
  args: {
    isOpen: true,
    title: '반 높이 바텀시트',
    confirmLabel: '확인',
    cancelLabel: '취소',
    height: 'half',
    rounded: false,
    children: <p>50% 높이의 바텀시트 내용입니다.</p>,
  },
};

export const FullHeight: Story = {
  args: {
    isOpen: true,
    title: '전체 높이 바텀시트',
    confirmLabel: '확인',
    cancelLabel: '취소',
    height: 'full',
    children: <p>100% 높이의 바텀시트 내용입니다.</p>,
  },
};

export const CustomHeightRounded: Story = {
  args: {
    isOpen: true,
    title: '커스텀 높이 바텀시트',
    confirmLabel: '확인',
    cancelLabel: '취소',
    height: 'custom',
    customHeight: '75vh',
    rounded: true,
    children: <p>75% 높이의 바텀시트 내용입니다.</p>,
  },
};

export const HalfHeightWithBack: Story = {
  args: {
    isOpen: true,
    title: '반 높이 뒤로가기 버튼 포함 바텀시트',
    confirmLabel: '확인',
    cancelLabel: '취소',
    height: 'half',
    rounded: true,
    showBackButton: true,
    showCloseButton: false,
    children: <p>50% 높이의 뒤로가기 버튼이 있는 바텀시트입니다.</p>,
  },
};

export const FullHeightWithBackAndClose: Story = {
  args: {
    isOpen: true,
    title: '전체 높이 뒤로가기 및 닫기 버튼 포함 바텀시트',
    confirmLabel: '확인',
    cancelLabel: '취소',
    height: 'full',
    showBackButton: true,
    showCloseButton: true,
    children: <p>100% 높이의 뒤로가기 및 닫기 버튼이 있는 바텀시트입니다.</p>,
  },
};

export const SingleButtonCustomHeight: Story = {
  args: {
    isOpen: true,
    title: '커스텀 높이, 단일 버튼 바텀시트',
    confirmLabel: '확인',
    height: 'custom',
    customHeight: '60vh',
    singleButton: true,
    children: <p>60% 높이의 단일 버튼 바텀시트 내용입니다.</p>,
  },
};

// import { BottomSheet } from './BottomSheet';
// import { Meta, StoryObj } from '@storybook/react';
// import { fn } from '@storybook/test';
// const meta = {
//   title: 'UI/BottomSheet',
//   component: BottomSheet,
//   parameters: {
//     layout: 'centered',
//   },
//   tags: ['autodocs'],
//   args: { onClose: fn() },
//   argTypes: {
//     isOpen: { control: 'boolean', description: '바텀시트가 열려 있는지 여부' },
//     title: { control: 'text', description: '바텀시트 제목' },
//     buttonLabel: { control: 'text', description: '하단 버튼의 텍스트' },
//   },
// } satisfies Meta<typeof BottomSheet>;
// export default meta;
// type Story = StoryObj<typeof meta>;

// export const HalfHeight: Story = {
//   args: {
//     isOpen: true,
//     title: '반 높이 바텀시트',
//     buttonLabel: '확인',
//     onButtonClick: fn(),
//     height: 'half',
//     children: <p>50% 높이의 바텀시트 내용입니다.</p>,
//   },
// };

// export const FullHeight: Story = {
//   args: {
//     isOpen: true,
//     title: '전체 높이 바텀시트',
//     buttonLabel: '확인',
//     onButtonClick: fn(),
//     height: 'full',
//     children: <p>100% 높이의 바텀시트 내용입니다.</p>,
//   },
// };

// export const HalfHeightWithBack: Story = {
//   args: {
//     isOpen: true,
//     title: ' 반 높이 뒤로가기 버튼 포함 바텀시트',
//     buttonLabel: '확인',
//     onButtonClick: fn(),
//     onBack: fn(), // 뒤로가기 버튼 동작 추가
//     height: 'half',
//     children: <p>50% 높이의 뒤로가기 버튼이 있는 바텀시트입니다.</p>,
//   },
// };

// export const FullHeightWithBack: Story = {
//   args: {
//     isOpen: true,
//     title: '전체 높이 뒤로가기 버튼 포함 바텀시트',
//     buttonLabel: '확인',
//     onButtonClick: fn(),
//     onBack: fn(), // 뒤로가기 버튼 동작 추가
//     height: 'full',
//     children: <p>100% 높이의 뒤로가기 버튼이 있는 바텀시트입니다.</p>,
//   },
// };
