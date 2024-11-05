import DraggableImageList from './DraggableImageList';
import PostImage from './PostImage';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { BottomSheet } from '@/stories/BottomSheet';

const ImageBottomSheet = () => {
  const { isFullHeightOpen, handleFullOpen, handleFullClose } = useBottomSheetStore();
  const { images } = useImageUploadStore();

  return (
    <article className='p-4'>
      <BottomSheet
        isOpen={isFullHeightOpen}
        onClose={handleFullClose}
        title='전체 높이 바텀시트'
        buttonLabel='확인'
        onButtonClick={() => alert('확인 버튼 클릭됨')}
        height='full'
      >
        <div>
          <PostImage showImages={true} />
        </div>
      </BottomSheet>

      <div className='flex item-start content-center overflow-x-auto'>
        <DraggableImageList />
        <button
          onClick={handleFullOpen}
          className='flex items-center flex-shrink-0 justify-center max-w-[200px] min-w-[200px] h-[200px] border cursor-pointer bg-gray-50 border-gray-100'
        >
          <span className='text-2xl font-bold text-gray-400'>+</span>
        </button>
      </div>
    </article>
  );
};

export default ImageBottomSheet;
