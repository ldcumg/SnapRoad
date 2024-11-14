import TextAreaWithCounter from './TextAreas';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TextAreaWithCounter> = {
  title: 'UI/TextArea',
  component: TextAreaWithCounter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    onChange: (e) => console.log(e.target.value),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'textarea',
    placeholder: '예시그룹',
    maxLength: 40,
    className: '',
  },
};
