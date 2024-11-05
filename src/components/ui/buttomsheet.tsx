import useBottomSheetStore from '@/stores/useBottomSheetStore';
import { BottomSheet } from '@/stories/BottomSheet';
import { Button } from '@/stories/Button';

// import { useState } from 'react';

export const Buttomsheet = () => {
  // const [isHalfHeightOpen, setIsHalfHeightOpen] = useState(false);

  // const [isFullHeightOpen, setIsFullHeightOpen] = useState(false);
  // const handleHalfOpen = () => setIsHalfHeightOpen(true);
  // const handleHalfClose = () => setIsHalfHeightOpen(false);
  // const handleFullOpen = () => setIsFullHeightOpen(true);
  // const handleFullClose = () => setIsFullHeightOpen(false);

  const { isHalfHeightOpen, isFullHeightOpen, handleHalfOpen, handleHalfClose, handleFullOpen, handleFullClose } =
    useBottomSheetStore();

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-8'>바텀시트 예제</h1>
      <div className='flex gap-4 pr-4'>
        {/* 반 높이 바텀시트 열기 버튼 */}
        <Button
          variant='primary'
          onClick={handleHalfOpen}
          label='반 높이 바텀시트 열기 (뒤로가기 포함)'
        />

        {/* 전체 높이 바텀시트 열기 버튼 */}
        <Button
          onClick={handleFullOpen}
          variant='secondary'
          label='전체 높이 바텀시트 열기'
        />
      </div>

      {/* 반 높이 바텀시트 (뒤로가기 버튼 포함) */}
      <BottomSheet
        isOpen={isHalfHeightOpen}
        onClose={handleHalfClose} // 닫기 버튼과 배경 클릭 시 닫기
        onBack={() => alert('뒤로가기 버튼 클릭됨')}
        title='반 높이 바텀시트'
        buttonLabel='확인'
        onButtonClick={() => alert('확인 버튼 클릭됨')}
        height='half'
      >
        <p>뒤로가기 버튼이 있는 반 높이의 바텀시트입니다.</p>
      </BottomSheet>

      {/* 전체 높이 바텀시트 */}
      <BottomSheet
        isOpen={isFullHeightOpen}
        onClose={handleFullClose} // 닫기 버튼과 배경 클릭 시 닫기
        title='전체 높이 바텀시트'
        buttonLabel='확인'
        onButtonClick={() => alert('확인 버튼 클릭됨')}
        height='full'
      >
        <p>전체 높이의 바텀시트입니다.</p>
      </BottomSheet>
    </div>
  );
};
