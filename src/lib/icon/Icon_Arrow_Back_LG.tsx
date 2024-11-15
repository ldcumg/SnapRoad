import React from 'react';

type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export const IconArrowBackLG = ({ width = 24, height = 24, color = '#121316', className }: IconProps) => {
  const viewBox = `0 0 ${width} ${height}`;

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      fill={color}
      viewBox={viewBox}
      className={className}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4.64645 12.3536C4.45118 12.1583 4.45118 11.8417 4.64645 11.6464L14.6464 1.64645C14.8417 1.45118 15.1583 1.45118 15.3536 1.64645C15.5488 1.84171 15.5488 2.15829 15.3536 2.35355L5.70711 12L15.3536 21.6464C15.5488 21.8417 15.5488 22.1583 15.3536 22.3536C15.1583 22.5488 14.8417 22.5488 14.6464 22.3536L4.64645 12.3536Z'
      />
    </svg>
  );
};
