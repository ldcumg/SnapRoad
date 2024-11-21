'use client';

import { IconCloseLG } from '@/lib/icon/Icon_Close_LG';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { BottomSheet } from '@/stories/BottomSheet';

type Props = Readonly<{
  children: React.ReactNode;
  desktop: boolean;
  postsPreView: {
    postId: string;
    postImageUrl: string;
  }[];
  setPostsPreview: React.Dispatch<
    React.SetStateAction<
      {
        postId: string;
        postImageUrl: string;
      }[]
    >
  >;
}>;

const PostsPreviewLayout = ({ children, desktop, postsPreView, setPostsPreview }: Props) => {
  const { isCustomHeightOpen, handleCustomClose } = useBottomSheetStore((state) => state);

  if (desktop) {
    return (
      <div className='shadow-[0px 0px 12px 0px rgba(0, 0, 0, 0.30)] fixed bottom-[30px] left-1/2 z-30 flex -translate-x-1/2 flex-col gap-[28px] rounded-[24px] border border-gray-100 bg-white p-[24px]'>
        <div className='flex justify-between'>
          <span className='text-title_lg text-primary-400'>{`총 ${postsPreView.length}개의 게시물이 있어요!`}</span>
          <button
            onClick={() => setPostsPreview([])}
            aria-label='게시물 미리보기 닫기'
          >
            <IconCloseLG />
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <BottomSheet
      height='custom'
      customHeight='250px'
      rounded={true}
      isOpen={isCustomHeightOpen}
      showHeader={true}
      showBackButton={false}
      hasButton={false}
      backdrop={false}
      title={`총 ${postsPreView.length}개의 게시물이 있어요!`}
      titleClassName='text-title_lg'
      onClose={() => {
        handleCustomClose();
        //NOTE - 임시
        setPostsPreview([]);
      }}
      headerClassName='pt-[40px] pb-[12px]'
    >
      {children}
    </BottomSheet>
  );
};

export default PostsPreviewLayout;
