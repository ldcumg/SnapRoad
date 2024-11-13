import React from 'react';

type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export const IconCloseCircle = ({ width = 24, height = 24, color = 'currentColor', className }: IconProps) => (
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
      d='M12.5 20C8.08172 20 4.5 16.4183 4.5 12C4.5 7.58172 8.08172 4 12.5 4C16.9183 4 20.5 7.58172 20.5 12C20.5 16.4183 16.9183 20 12.5 20ZM8.64646 8.14645C8.84172 7.95118 9.15831 7.95118 9.35357 8.14645L12.5 11.2929L15.6464 8.14652C15.8417 7.95126 16.1583 7.95126 16.3536 8.14652C16.5488 8.34178 16.5488 8.65837 16.3536 8.85363L13.2072 12L16.3536 15.1464C16.5488 15.3417 16.5488 15.6583 16.3536 15.8536C16.1583 16.0488 15.8417 16.0488 15.6465 15.8536L12.5 12.7071L9.35355 15.8536C9.15829 16.0489 8.84171 16.0489 8.64645 15.8536C8.45118 15.6584 8.45118 15.3418 8.64645 15.1465L11.7929 12L8.64646 8.85355C8.4512 8.65829 8.4512 8.34171 8.64646 8.14645Z'
      fill='#6E7387'
    />
  </svg>
);
