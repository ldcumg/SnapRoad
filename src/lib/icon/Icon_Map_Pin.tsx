import React from 'react';

type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export const IconMapPin = ({ width = 24, height = 24, color = 'currentColor', className }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    fill={color}
    viewBox='0 0 24 24'
    className={className}
  >
    <g id='Map_Pin'>
      <g id='Vector'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M12 2.5C7.85786 2.5 4.5 5.85786 4.5 10C4.5 12.7951 5.85142 15.2858 7.46434 17.2585C9.07385 19.227 10.9045 20.631 11.771 21.2421C11.9107 21.3406 12.0893 21.3406 12.229 21.2421C13.0955 20.631 14.9262 19.227 16.5357 17.2585C18.1486 15.2858 19.5 12.7951 19.5 10C19.5 5.85786 16.1421 2.5 12 2.5ZM3.5 10C3.5 5.30558 7.30558 1.5 12 1.5C16.6944 1.5 20.5 5.30558 20.5 10C20.5 13.1197 18.9955 15.8298 17.3098 17.8915C15.6207 19.9573 13.71 21.4213 12.8054 22.0593C12.3201 22.4015 11.6799 22.4015 11.1946 22.0593C10.29 21.4213 8.3793 19.9573 6.69017 17.8915C5.00446 15.8298 3.5 13.1197 3.5 10Z'
          fill='#009E6C'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5ZM8.5 9C8.5 7.067 10.067 5.5 12 5.5C13.933 5.5 15.5 7.067 15.5 9C15.5 10.933 13.933 12.5 12 12.5C10.067 12.5 8.5 10.933 8.5 9Z'
          fill='#009E6C'
        />
      </g>
    </g>
  </svg>
);
