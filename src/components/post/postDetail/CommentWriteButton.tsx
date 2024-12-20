import React from 'react';

type CommentWriteButtonProps = {
  setIsWriteMode: React.Dispatch<React.SetStateAction<boolean>>;
};

/** 댓글 작성 버튼 */
const CommentWriteButton = ({ setIsWriteMode }: CommentWriteButtonProps) => {
  return (
    <div className='w-full px-4 py-2'>
      <button
        className='my-2 w-full rounded-[24px] border border-gray-100 px-3 py-2 text-start'
        onClick={(e) => setIsWriteMode(true)}
      >
        <p className='text-body_sm text-gray-300'>댓글을 입력해주세요.</p>
      </button>
    </div>
  );
};

export default CommentWriteButton;
