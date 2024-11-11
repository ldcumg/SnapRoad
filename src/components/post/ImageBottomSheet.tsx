'use client';

import DraggableImageList from './DraggableImageList';
import PostImage from './PostImage';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { BottomSheet } from '@/stories/BottomSheet';

const ImageBottomSheet = () => {
  const { isFullHeightOpen, handleFullOpen, handleFullClose } = useBottomSheetStore();
  const { images } = useImageUploadStore();
  const title = `${images.length} / 10`;

  return (
    <>
      {/* <div
        className={`flex content-center items-start overflow-x-auto p-6 ${images.length > 0 ? 'w-auto' : 'w-full'} `}
      > */}
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
      {/* <div className='flex content-center items-start'>
        <DraggableImageList />
        <button
          onClick={handleFullOpen}
          className={`flex h-[240px] min-w-[240px] max-w-[240px] flex-shrink-0 cursor-pointer items-center justify-center border border-gray-100 bg-gray-50 ${images.length > 0 ? 'ml-4' : ''}`}
        >
          <span className='text-2xl font-bold text-gray-400'>+</span>
        </button>
      </div> */}
      {/* </div> */}
    </>
  );
};

export default ImageBottomSheet;
