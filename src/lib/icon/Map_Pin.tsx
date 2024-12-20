const MapPin = ({ className }: { className?: string }) => (
  <svg
    width='38'
    height='58'
    viewBox='0 0 38 58'
    fill='none'
    className={className}
    xmlns='http://www.w3.org/2000/svg'
  >
    <g filter='url(#filter0_d_1435_8815)'>
      <mask
        id='path-1-outside-1_1435_8815'
        maskUnits='userSpaceOnUse'
        x='4'
        y='1'
        width='30'
        height='50'
        fill='black'
      >
        <rect
          fill='white'
          x='4'
          y='1'
          width='30'
          height='50'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M33 16C33 23.3958 27.2653 29.4521 20 29.9648V46.2676C20.5978 46.6134 21 47.2597 21 48C21 49.1046 20.1046 50 19 50C17.8954 50 17 49.1046 17 48C17 47.2597 17.4022 46.6134 18 46.2676V29.9648C10.7347 29.4521 5 23.3958 5 16C5 8.26801 11.268 2 19 2C26.732 2 33 8.26801 33 16Z'
        />
      </mask>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M33 16C33 23.3958 27.2653 29.4521 20 29.9648V46.2676C20.5978 46.6134 21 47.2597 21 48C21 49.1046 20.1046 50 19 50C17.8954 50 17 49.1046 17 48C17 47.2597 17.4022 46.6134 18 46.2676V29.9648C10.7347 29.4521 5 23.3958 5 16C5 8.26801 11.268 2 19 2C26.732 2 33 8.26801 33 16Z'
        fill='#FFABF1'
      />
      <path
        d='M20 29.9648L19.9296 28.9673L19 29.0329V29.9648H20ZM20 46.2676H19V46.8444L19.4993 47.1332L20 46.2676ZM18 46.2676L18.5007 47.1332L19 46.8444V46.2676H18ZM18 29.9648H19V29.0329L18.0704 28.9673L18 29.9648ZM20.0704 30.9624C27.8556 30.4129 34 23.9244 34 16H32C32 22.8671 26.6749 28.4913 19.9296 28.9673L20.0704 30.9624ZM21 46.2676V29.9648H19V46.2676H21ZM19.4993 47.1332C19.8008 47.3076 20 47.6311 20 48H22C22 46.8883 21.3948 45.9192 20.5007 45.402L19.4993 47.1332ZM20 48C20 48.5523 19.5523 49 19 49V51C20.6569 51 22 49.6569 22 48H20ZM19 49C18.4477 49 18 48.5523 18 48H16C16 49.6569 17.3431 51 19 51V49ZM18 48C18 47.6311 18.1992 47.3076 18.5007 47.1332L17.4993 45.402C16.6052 45.9192 16 46.8883 16 48H18ZM17 29.9648V46.2676H19V29.9648H17ZM4 16C4 23.9244 10.1444 30.4129 17.9296 30.9624L18.0704 28.9673C11.3251 28.4913 6 22.8671 6 16H4ZM19 1C10.7157 1 4 7.71573 4 16H6C6 8.8203 11.8203 3 19 3V1ZM34 16C34 7.71573 27.2843 1 19 1V3C26.1797 3 32 8.8203 32 16H34Z'
        fill='#C653B3'
        mask='url(#path-1-outside-1_1435_8815)'
      />
      <circle
        cx='19'
        cy='16'
        r='3.5'
        fill='white'
        stroke='#C653B3'
      />
    </g>
    <defs>
      <filter
        id='filter0_d_1435_8815'
        x='0'
        y='0'
        width='38'
        height='58'
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
        <feOffset dy='3' />
        <feGaussianBlur stdDeviation='2' />
        <feComposite
          in2='hardAlpha'
          operator='out'
        />
        <feColorMatrix
          type='matrix'
          values='0 0 0 0 0.515035 0 0 0 0 0.243299 0 0 0 0 0.465216 0 0 0 0.6 0'
        />
        <feBlend
          mode='normal'
          in2='BackgroundImageFix'
          result='effect1_dropShadow_1435_8815'
        />
        <feBlend
          mode='normal'
          in='SourceGraphic'
          in2='effect1_dropShadow_1435_8815'
          result='shape'
        />
      </filter>
    </defs>
  </svg>
);

export default MapPin;
