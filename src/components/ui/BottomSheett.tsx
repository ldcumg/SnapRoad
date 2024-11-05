import { useEffect } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const BottomSheet = ({ isOpen, onClose }: BottomSheetProps) => {
  useEffect(() => {
    // 바텀 시트가 열리면 body의 스크롤을 막습니다.
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // 컴포넌트가 언마운트될 때 스크롤을 복원합니다.
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative bg-white w-full h-1/2 rounded-t-2xl p-6 shadow-lg transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 px-4 py-2 font-semibold text-black transition duration-300'
        >
          X
        </button>
        <div className='text-xl font-semibold mb-4 text-black'>바텀시트 애니메이션</div>
        <div className='mb-4 text-black'>
          <p className='border border-b h-[400px]'>바텀시트 애니메이션</p>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
