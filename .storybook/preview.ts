import '@/src/lib/styles/fonts.css';
import '@/src/lib/styles/globals.css';
import type { Preview } from '@storybook/react';


// 폰트 정의 CSS 파일 임포트 (필요한 경우)

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  tags: ['autodocs'],
};

export default preview;