// import DraggableImageList from './DraggableImageList';
import PostImage from './PostImage';
import useBottomSheetStore from '@/stores/useBottomSheetStore';
import { BottomSheet } from '@/stories/BottomSheet';

interface ImageListProps {
  uploadSessionId: string;
}

const ImageBottomSheet = ({ uploadSessionId }: ImageListProps) => {
  const { isFullHeightOpen, handleFullOpen, handleFullClose } = useBottomSheetStore();

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
          <PostImage uploadSessionId={uploadSessionId} />
        </div>
      </BottomSheet>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        <button
          onClick={handleFullOpen}
          className='flex items-center justify-center w-[200px] h-[200px] border cursor-pointer'
        >
          <span className='text-2xl font-bold text-gray-400'>+</span>
        </button>
        {/* <DraggableImageList /> */}
      </div>
    </article>
  );
};

export default ImageBottomSheet;
