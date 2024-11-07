'use client';

import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { BottomSheet } from '@/stories/BottomSheet';
import { Button } from '@/stories/Button';

export const Buttomsheet = () => {
  // const [isHalfHeightOpen, setIsHalfHeightOpen] = useState(false);

  // const [isFullHeightOpen, setIsFullHeightOpen] = useState(false);
  // const handleHalfOpen = () => setIsHalfHeightOpen(true);
  // const handleHalfClose = () => setIsHalfHeightOpen(false);
  // const handleFullOpen = () => setIsFullHeightOpen(true);
  // const handleFullClose = () => setIsFullHeightOpen(false);

  const {
    isHalfHeightOpen,
    isFullHeightOpen,
    handleHalfOpen,
    handleHalfClose,
    handleFullOpen,
    handleFullClose,
    isCustomHeightOpen,
    handleCustomOpen,
    handleCustomClose,
  } = useBottomSheetStore();

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-8'>Bottom Sheet Example with All Options</h1>

      <div className='flex gap-4'>
        {/* 반 높이 바텀시트 열기 버튼 */}
        <Button
          onClick={handleHalfOpen}
          variant='primary'
          label='Open Half Height (Rounded)'
        />

        {/* 전체 높이 바텀시트 열기 버튼 */}
        <Button
          onClick={handleFullOpen}
          variant='secondary'
          label='Open Full Height'
        />

        {/* 커스텀 높이 바텀시트 열기 버튼 */}
        <Button
          onClick={handleCustomOpen}
          variant='primary'
          label='Open Custom Height (75%)'
        />
      </div>

      {/* 반 높이 바텀시트 (라운디드 모드 및 뒤로가기 버튼 포함) */}
      <BottomSheet
        isOpen={isHalfHeightOpen}
        onClose={handleHalfClose}
        title='Half Height Bottom Sheet (Rounded)'
        confirmLabel='Confirm'
        cancelLabel='Cancel'
        height='half'
        rounded={true}
        onConfirm={() => alert('Confirm button clicked')}
      >
        <p>This is a half-height bottom sheet with rounded corners and two buttons.</p>
      </BottomSheet>

      {/* 전체 높이 바텀시트 (버튼 하나만 표시) */}
      <BottomSheet
        isOpen={isFullHeightOpen}
        onClose={handleFullClose}
        title='Full Height Bottom Sheet (Single Button)'
        confirmLabel='Close'
        height='full'
        onConfirm={() => alert('Close button clicked')}
      >
        <p>This is a full-height bottom sheet with a single button.</p>
      </BottomSheet>

      {/* 커스텀 높이 바텀시트 (75% 높이, 라운드 없음) */}
      <BottomSheet
        isOpen={isCustomHeightOpen}
        onClose={handleCustomClose}
        title='Custom Height Bottom Sheet (75%)'
        confirmLabel='Confirm'
        cancelLabel='Cancel'
        height='custom'
        customHeight='75vh' // 75% 높이 지정
        rounded={false}
        onConfirm={() => alert('Confirm button clicked')}
      >
        <p>This is a custom-height bottom sheet (75% of screen height) with no rounded corners.</p>
      </BottomSheet>
    </div>
  );
};
