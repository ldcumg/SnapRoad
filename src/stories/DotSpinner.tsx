export const DotSpinner = () => {
  return (
    <div className='relative flex h-12 w-12 items-center justify-center'>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className='absolute h-1.5 w-1.5 animate-color-change rounded-full bg-gray-100'
          style={{
            transform: `rotate(${i * 45}deg) translateX(15px)`,
            animationDelay: `${i * 0.1125}s`,
          }}
        />
      ))}
    </div>
  );
};
