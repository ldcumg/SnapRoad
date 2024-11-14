const ErrorMarker = ({ width = 40, height = 75 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 49 76'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g filter='url(#filter0_d_1816_7853)'>
        <path
          d='M41.23 31.8275C42.64 29.3364 44.5 24.9146 44.5 20.8678C44.5 9.81817 35.545 0.859375 24.5 0.859375C13.455 0.859375 4.5 9.81817 4.5 20.8678C4.5 24.9146 6.365 29.3414 7.77 31.8275C10.2992 36.2988 17.1388 46.3274 21.2475 52.2741C22.8243 54.5562 26.1757 54.5562 27.7525 52.2741C31.8612 46.3274 38.7008 36.2988 41.23 31.8275Z'
          fill='#009E6C'
        />
      </g>
      <path
        d='M24.1406 21.1719C27.8081 21.1719 30.7812 18.1988 30.7812 14.5312C30.7812 10.8637 27.8081 7.89062 24.1406 7.89062C20.4731 7.89062 17.5 10.8637 17.5 14.5312C17.5 18.1988 20.4731 21.1719 24.1406 21.1719Z'
        fill='white'
      />
      <path
        d='M24.1406 75.1406C27.8081 75.1406 30.7812 72.1675 30.7812 68.5C30.7812 64.8325 27.8081 61.8594 24.1406 61.8594C20.4731 61.8594 17.5 64.8325 17.5 68.5C17.5 72.1675 20.4731 75.1406 24.1406 75.1406Z'
        fill='#009E6C'
      />
      <defs>
        <filter
          id='filter0_d_1816_7853'
          x='0.5'
          y='0.859375'
          width='48'
          height='61.1265'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood
            floodOpacity='0'
            result='BackgroundImageFix'
          />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset dy='4' />
          <feGaussianBlur stdDeviation='2' />
          <feComposite
            in2='hardAlpha'
            operator='out'
          />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_1816_7853'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_1816_7853'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  );
};

export default ErrorMarker;
