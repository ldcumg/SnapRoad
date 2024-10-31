'use client';

const Tracker = ({ position, angle }) => {
  return (
    <div
      className={'tracker'}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={() => {
        map.setCenter(positionLatlng);
        setVisible(false);
      }}
    >
      <div
        className={'balloon'}
        style={{
          transform: `rotate(${angle}deg)`,
        }}
      ></div>
      <div className={'icon'}></div>
    </div>
  );
};

export default Tracker;
