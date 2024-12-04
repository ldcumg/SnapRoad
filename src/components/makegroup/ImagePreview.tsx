type Props = {
  imgPreview: string | null;
};

const ImagePreview = ({ imgPreview }: Props) => {
  return (
    <>
      {imgPreview ? (
        <div className='relative flex h-[216px] w-[232px] items-start justify-center rounded-xl'>
          <img
            src={imgPreview}
            alt='업로드 그룹 썸네일 이미지'
            className='flex h-[200px] w-[200px] items-center justify-center rounded-xl border border-gray-100'
          />
          <div className='absolute bottom-0 right-0 flex h-[48px] w-[48px] items-center justify-center rounded-[24px] bg-white shadow-BG_S'>
            <img
              src='/svgs/cameraIcon.svg'
              alt=''
              className='h-6 w-6'
            />
          </div>
        </div>
      ) : (
        <div className='relative flex h-[216px] w-[232px] items-start justify-center rounded-xl'>
          <img
            className='flex h-[200px] w-[200px] items-center justify-center rounded-xl border border-gray-100'
            src='/images/group_default_thumbnail.webp'
            alt='그룹 기본 이미지'
          />
          <div className='absolute bottom-0 right-0 flex h-[48px] w-[48px] items-center justify-center rounded-[24px] bg-white shadow-BG_S'>
            <img
              src='/svgs/cameraIcon.svg'
              alt=''
              className='h-6 w-6'
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview;
