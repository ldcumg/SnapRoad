import ScrollReactHeader from '@/components/_common/ScrollReactHeader';
import ScrollSections from '@/components/landing/ScrollSections';
import LogoUserHeader from '@/components/layout/LogoUserHeader';

const Page = () => {
  return (
    <>
      <ScrollReactHeader>
        <LogoUserHeader />
      </ScrollReactHeader>
      <ScrollSections />
    </>
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
