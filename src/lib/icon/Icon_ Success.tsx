import React from 'react';


type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export const IconSuccess = ({ width = 65, height = 64, color = 'currentColor', className }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    fill={color}
    viewBox='0 0 65 64'
    className={className}
  >
    <g id='Group 37'>
      <circle
        id='Ellipse 113'
        cx='32.5'
        cy='32'
        r='32'
        fill='#DCF4EC'
      />
      <path
        id='Vector 240'
        d='M13.5 32.4558L26.2279 45.1838L51.6837 19.7279'
        stroke='#009E6C'
        stroke-width='4'
        stroke-linecap='round'
      />
    </g>
  </svg>
);