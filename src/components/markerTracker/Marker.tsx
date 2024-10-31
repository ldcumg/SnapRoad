'use client';

import 'react';

const Marker = ({ tooltipText }) => {
  const [isOver, setIsOver] = useState(false);
  return (
    <div
      className={`node`}
      onMouseOver={() => {
        setIsOver(true);
      }}
      onMouseOut={() => {
        setIsOver(false);
      }}
    >
      {isOver && <div className={`tooltip`}>{tooltipText}</div>}
    </div>
  );
};

export default Marker;
