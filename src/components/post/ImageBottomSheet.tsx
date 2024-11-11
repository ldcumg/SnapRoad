'use client';

import PostImage from './PostImage';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { BottomSheet } from '@/stories/BottomSheet';

const ImageBottomSheet = () => {
  const { isFullHeightOpen, handleFullClose } = useBottomSheetStore();
  const { images } = useImageUploadStore();
  const title = `${images.length} / 10`;

  return (
    <BottomSheet
      isOpen={isFullHeightOpen}
      onClose={handleFullClose}
      title={title}
      confirmLabel='확인'
      onconfirmButtonClick={handleFullClose}
      singleButton={true}
      height='full'
    >
      <>
        <PostImage showImages={true} />
      </>
    </BottomSheet>
  );
};

export default ImageBottomSheet;
