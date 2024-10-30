import { ReactNode } from 'react';

type Props = {
  isModalOpen: boolean;
  handleModalOpen: () => void;
  children: ReactNode;
};

/**
 * @function Modal = 모달 공통 컴포넌트
 * @param isModalOpen (boolean) = 모달 열림 상태
 * @param handleModalOpen (()=>void) = 모달 열고 닫는 함수
 * @param children (ReactNode) = 모달 본문에 들어갈 컴포넌트
 * */
const Modal = ({ isModalOpen, handleModalOpen, children }: Props) => {
  return (
    <div
      className={`${
        isModalOpen ? 'flex' : 'hidden'
      } fixed z-10 top-0 left-0 w-full h-full justify-center items-center bg-[#c5c5c5] bg-opacity-30`}
    >
      {/* NOTE - 모달 배경 */}
      <div
        className='absolute top-0 left-0 z-20 w-full h-full'
        onClick={handleModalOpen}
      ></div>

      {/* NOTE - 모달 본문 */}
      {children}
    </div>
  );
};

export default Modal;
