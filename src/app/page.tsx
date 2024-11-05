
'use client';

import BottomSheet from '@/components/ui/BottomSheett';
import { useState } from 'react';

const Page = () => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const openBottomSheet = () => setIsBottomSheetOpen(true);
  const closeBottomSheet = () => setIsBottomSheetOpen(false);

  return (
    <div className='h-screen flex flex-col items-center justify-center bg-gray-800 text-white'>
      <button
        onClick={openBottomSheet}
        className='px-8 py-4 text-2xl font-semibold bg-gradient-to-r from-yellow-400 to-green-500 rounded-full shadow-lg hover:shadow-2xl transition duration-300'
      >
        Open Bottom Sheet
      </button>
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={closeBottomSheet}
      />
    </div>
  );
};

export default Page;

// 'use client';
// import ScrollSections from '@/components/landing/ScrollSections';
// import ModalAnimation from '@/components/ui/ModalAnimation';
// import { useState } from 'react';
// const Page = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);
//   return (
//     <>
//       <ScrollSections />
//       <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300'>
//         버튼 클릭
//       </button>
//       <ModalAnimation />
//     </>
//   );
// };
// export default Page;
// components/ui/BottomSheet.tsx
