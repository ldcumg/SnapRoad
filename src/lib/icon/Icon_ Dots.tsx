import React from 'react';

type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export const IconDots = ({ width = 24, height = 24, color = '#121316', className }: IconProps) => {
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
      <circle
        cx={(7 / 24) * width}
        cy={(12 / 24) * height}
        r={1}
      />
      <circle
        cx={(12 / 24) * width}
        cy={(12 / 24) * height}
        r={1}
      />
      <circle
        cx={(17 / 24) * width}
        cy={(12 / 24) * height}
        r={1}
      />
    </svg>
  );
};
