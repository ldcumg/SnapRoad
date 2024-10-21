// Input.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Example/Input',
  component: Input,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' }
  },
  args: {
    onChange: (e) => console.log(e.target.value)
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username'
  }
}

export const Disabled: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    disabled: true
  }
}

export const WithCustomPlaceholder: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com'
  }
}

export const Large: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    size: 'large'
  }
}
export const medium: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    size: 'medium'
  }
}

export const Small: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    size: 'small'
  }
}
