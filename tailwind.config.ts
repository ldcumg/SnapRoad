import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        origin: 'hsl(var(--origin))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        danger: 'hsl(var(--danger))',
        primary: {
          50: 'hsl(var(--primary-50))',
          200: 'hsl(var(--primary-200))',
          400: 'hsl(var(--primary-400))',
          600: 'hsl(var(--primary-600))',
        },
        secondary: {
          50: 'hsl(var(--secondary-50))',
          100: 'hsl(var(--secondary-100))',
          400: 'hsl(var(--secondary-400))',
          600: 'hsl(var(--secondary-600))',
        },
        gray: {
          50: 'hsl(var(--gray-50))',
          100: 'hsl(var(--gray-100))',
          200: 'hsl(var(--gray-200))',
          300: 'hsl(var(--gray-300))',
          400: 'hsl(var(--gray-400))',
          500: 'hsl(var(--gray-500))',
          600: 'hsl(var(--gray-600))',
          700: 'hsl(var(--gray-700))',
          800: 'hsl(var(--gray-800))',
          900: 'hsl(var(--gray-900))',
        },
      },
      card: {
        gray: {
          50: 'hsl(var(--gray-50))',
          100: 'hsl(var(--gray-100))',
          200: 'hsl(var(--gray-200))',
          300: 'hsl(var(--gray-300))',
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Arial', 'sans-serif'],
      },
      fontSize: {
        head_lg: [
          '32px',
          {
            lineHeight: '135%',
            fontWeight: '600',
          },
        ],
        head_m: [
          '28px',
          {
            lineHeight: '135%',
            fontWeight: '600',
          },
        ],
        head_sm: [
          '24px',
          {
            lineHeight: '135%',
            fontWeight: '600',
          },
        ],
        title_xl: [
          '20px',
          {
            lineHeight: '135%',
            fontWeight: '600',
          },
        ],
        title_lg: [
          '18px',
          {
            lineHeight: '135%',
            fontWeight: '600',
          },
        ],
        label_md: [
          '16px',
          {
            lineHeight: '135%',
            fontWeight: '600',
          },
        ],
        label_sm: [
          '14px',
          {
            lineHeight: '135%',
            fontWeight: '600',
          },
        ],
        body_lg: [
          '18px',
          {
            lineHeight: '150%',
            fontWeight: '300',
          },
        ],
        body_md: [
          '16px',
          {
            lineHeight: '150%',
            fontWeight: '300',
          },
        ],
        body_sm: [
          '14px',
          {
            lineHeight: '150%',
            fontWeight: '300',
          },
        ],
        caption_bold_lg: [
          '12px',
          {
            lineHeight: '135%',
            fontWeight: '600',
          },
        ],
        caption_bold_md: [
          '10px',
          {
            lineHeight: '135%',
            fontWeight: '600',
          },
        ],
        caption_light_lg: [
          '12px',
          {
            lineHeight: '150%',
            fontWeight: '300',
          },
        ],
        caption_light_md: [
          '10px',
          {
            lineHeight: '150%',
            fontWeight: '300',
          },
        ],
      },
      boxShadow: {
        BG_S: '0px 0px 4px rgba(0, 0, 0, 0.25)',
        BG_grn: '0px 0px 4px #009E6C',
        BG_TopButton: '0px 0px 8px rgba(86, 48, 86, 35)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'white-to-transparent-to-white':
          'linear-gradient(to bottom, white 0%, rgba(255, 255, 255, 0.5) 22.5%, rgba(255, 255, 255, 0) 45%, rgba(255, 255, 255, 0) 55%,rgba(255, 255, 255, 0.5) 77.5%, white 90%)',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true, // 모바일 호버 해제
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
