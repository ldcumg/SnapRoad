import React from 'react';

type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export const IconCloseLG = ({ width = 24, height = 24, color = 'currentColor', className }: IconProps) => (
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
      d='M2.64645 2.64645C2.84171 2.45118 3.15829 2.45118 3.35355 2.64645L12 11.2929L20.6464 2.64645C20.8417 2.45118 21.1583 2.45118 21.3536 2.64645C21.5488 2.84171 21.5488 3.15829 21.3536 3.35355L12.7071 12L21.3535 20.6463C21.5487 20.8416 21.5487 21.1582 21.3535 21.3535C21.1582 21.5487 20.8416 21.5487 20.6463 21.3535L12 12.7071L3.35355 21.3536C3.15829 21.5488 2.84171 21.5488 2.64645 21.3536C2.45118 21.1583 2.45118 20.8417 2.64645 20.6464L11.2929 12L2.64645 3.35355C2.45118 3.15829 2.45118 2.84171 2.64645 2.64645Z'
      fill='#121316'
    />
  </svg>
);
