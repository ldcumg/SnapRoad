import React from 'react';

type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export const IconClock = ({ width = 24, height = 24, color = 'currentColor', className }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    fill={color}
    viewBox='0 0 24 24'
    className={className}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12 2.5C6.75329 2.5 2.5 6.75329 2.5 12C2.5 17.2467 6.75329 21.5 12 21.5C17.2467 21.5 21.5 17.2467 21.5 12C21.5 6.75329 17.2467 2.5 12 2.5ZM1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12Z'
      fill='#121316'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12 5.5C12.2761 5.5 12.5 5.72386 12.5 6V11.5H18C18.2761 11.5 18.5 11.7239 18.5 12C18.5 12.2761 18.2761 12.5 18 12.5H12C11.7239 12.5 11.5 12.2761 11.5 12V6C11.5 5.72386 11.7239 5.5 12 5.5Z'
      fill='#121316'
    />
  </svg>
);
