import React from 'react';

type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export const Icon = ({ width = 24, height = 24, color = 'currentColor', className }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    fill={color}
    viewBox='0 0 24 24'
    className={className}
  ></svg>
);
