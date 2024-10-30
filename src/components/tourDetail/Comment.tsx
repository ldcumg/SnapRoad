import React from 'react';

const Comment = ({ nickname, commentDesc }: { nickname: string; commentDesc: string }) => {
  return (
    <div className='flex items-center gap-1 w-full'>
      <div>이미지</div>
      <div className='w-full'>
        <span className='font-bold'>{nickname}</span>
        <div className='flex justify-between'>
          <p>{commentDesc}</p>
          <button>삭제</button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
