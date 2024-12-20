import React from 'react';

type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export const IconPluslg = ({ width = 24, height = 24, color = 'currentColor', className }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    fill={color}
    viewBox='0 0 24 24'
    className={className}
  >
    <path
      d='M12.5 2C12.5 1.72386 12.2761 1.5 12 1.5C11.7239 1.5 11.5 1.72386 11.5 2V11.5H2C1.72386 11.5 1.5 11.7239 1.5 12C1.5 12.2761 1.72386 12.5 2 12.5H11.5V22C11.5 22.2761 11.7239 22.5 12 22.5C12.2761 22.5 12.5 22.2761 12.5 22V12.5H22C22.2761 12.5 22.5 12.2761 22.5 12C22.5 11.7239 22.2761 11.5 22 11.5H12.5V2Z'
      fill='#121316'
    />
  </svg>
);
