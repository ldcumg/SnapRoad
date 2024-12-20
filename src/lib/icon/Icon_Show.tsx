import React from 'react';

type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export const IconShow = ({ width = 24, height = 24, color = 'currentColor', className }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    fill={color}
    viewBox='0 0 24 24'
    className={className}
  >
    <g id='Show'>
      <g id='Vector'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M11.9201 8.48999C9.98711 8.48999 8.42011 10.057 8.42011 11.99C8.42011 13.923 9.98711 15.49 11.9201 15.49C13.8531 15.49 15.4201 13.923 15.4201 11.99C15.4201 10.057 13.8531 8.48999 11.9201 8.48999ZM7.42011 11.99C7.42011 9.50471 9.43483 7.48999 11.9201 7.48999C14.4054 7.48999 16.4201 9.50471 16.4201 11.99C16.4201 14.4753 14.4054 16.49 11.9201 16.49C9.43483 16.49 7.42011 14.4753 7.42011 11.99Z'
          fill='#6E7387'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M11.9201 6.5C5.46081 6.5 3.11992 10.5457 2.54447 11.7987C2.48587 11.9256 2.48544 12.0632 2.54396 12.1902C3.12021 13.4356 5.46178 17.49 11.9201 17.49C18.3794 17.49 20.7203 13.4443 21.2957 12.1913C21.3544 12.0643 21.3548 11.9266 21.2961 11.7995C20.72 10.5544 18.3787 6.5 11.9201 6.5ZM1.63572 11.3813C2.30027 9.93432 4.91938 5.5 11.9201 5.5C18.9215 5.5 21.54 9.94516 22.2039 11.38C22.3852 11.773 22.3854 12.2166 22.2041 12.6095C21.5395 14.0565 18.9208 18.49 11.9201 18.49C4.91873 18.49 2.30021 14.0448 1.63632 12.61C1.45496 12.217 1.45436 11.7743 1.63572 11.3813Z'
          fill='#6E7387'
        />
      </g>
    </g>
  </svg>
);
