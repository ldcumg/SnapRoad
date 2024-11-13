const SearchResultMarker = ({ className }: { className?: string }) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
  >
    <g filter='url(#filter0_d_1435_8822)'>
      <circle
        cx='12'
        cy='9'
        r='8'
        fill='#FFABF1'
      />
      <circle
        cx='12'
        cy='9'
        r='7.5'
        stroke='#C653B3'
      />
    </g>
    <defs>
      <filter
        id='filter0_d_1435_8822'
        x='0'
        y='0'
        width='24'
        height='24'
        filterUnits='userSpaceOnUse'
        color-interpolation-filters='sRGB'
      >
        <feFlood
          flood-opacity='0'
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
          result='effect1_dropShadow_1435_8822'
        />
        <feBlend
          mode='normal'
          in='SourceGraphic'
          in2='effect1_dropShadow_1435_8822'
          result='shape'
        />
      </filter>
    </defs>
  </svg>
);

export default SearchResultMarker;
