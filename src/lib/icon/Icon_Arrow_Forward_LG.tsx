type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export const IconArrowForwardLG = ({ width = 24, height = 24, color = '#121316', className }: IconProps) => (
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
      d='M19.3536 12.3536C19.5488 12.1583 19.5488 11.8417 19.3536 11.6464L9.35356 1.64645C9.15829 1.45118 8.84171 1.45118 8.64645 1.64645C8.45119 1.84171 8.45119 2.15829 8.64645 2.35355L18.2929 12L8.64645 21.6464C8.45118 21.8417 8.45118 22.1583 8.64645 22.3536C8.84171 22.5488 9.15829 22.5488 9.35355 22.3536L19.3536 12.3536Z'
      //   fill='#121316'
    />
  </svg>
);
