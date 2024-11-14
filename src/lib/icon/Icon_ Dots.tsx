import React from 'react';

type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export const IconDots = ({ width = 24, height = 24, color = 'currentColor', className }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    fill={color}
    viewBox='0 0 24 24'
    className={className}
  >
    <circle
      cx='7'
      cy='12'
      r='1'
      fill='#121316'
    />
    <circle
      cx='12'
      cy='12'
      r='1'
      fill='#121316'
    />
    <circle
      cx='17'
      cy='12'
      r='1'
      fill='#121316'
    />
  </svg>
);
