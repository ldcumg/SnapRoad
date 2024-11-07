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
    <article
      className={`p-6 flex items-start content-center overflow-x-auto ${images.length > 0 ? 'w-auto' : 'w-full'} `}
    >
      <BottomSheet
        isOpen={isFullHeightOpen}
        onClose={handleFullClose}
        title={title}
        confirmLabel='확인'
        onconfirmButtonClick={handleFullClose}
        singleButton={true}
        height='full'
      >
        <div>
          <PostImage showImages={true} />
        </div>
      </BottomSheet>

      <div className='flex items-start content-center'>
        <DraggableImageList />
        <button
          onClick={handleFullOpen}
          className={`flex items-center flex-shrink-0 justify-center max-w-[240px] min-w-[240px] h-[240px] border cursor-pointer bg-gray-50 border-gray-100 ${images.length > 0 ? 'ml-4' : ''}`}
        >
          <span className='text-2xl font-bold text-gray-400'>+</span>
        </button>
      </div>
    </article>
  );
};

export default ImageBottomSheet;
