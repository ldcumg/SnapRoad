type Props = {
  imgPreview: string | null;
};

const ImagePreview = ({ imgPreview }: Props) => {
  return (
    <>
      {imgPreview ? (
        <div className='relative flex justify-center items-center w-[182px] h-[182px]'>
          <img
            src={imgPreview}
            alt='업로드 그룹 썸네일 이미지'
            className='flex justify-center items-center w-[130px] h-[130px] border-[2px] border-black border-solid'
          />
          <div className='absolute bottom-0 right-0 w-[52px] h-[52px] flex justify-center items-center border border-solid border-black rounded-[26px] bg-white'>
            <img
              src='/svgs/cameraIcon.svg'
              alt=''
            />
          </div>
        </div>
      ) : (
        <div className='relative flex justify-center items-center w-[182px] h-[182px]'>
          <img
            className='w-[130px] h-[130px]'
            src='/images/group_default_thumbnail.png'
            alt=''
          />
          <div className='absolute bottom-0 right-0 w-[52px] h-[52px] flex justify-center items-center border border-solid border-black rounded-[26px] bg-white'>
            <img
              src='/svgs/cameraIcon.svg'
              alt=''
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview;
