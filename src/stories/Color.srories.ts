import { ColorChart } from './ColorChart';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Example/ColorChart',
  component: ColorChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ColorChart>;

// export const Default: Story = {
//   render: () => <ColorChart />
// };
