import React from 'react';

const Comment = ({ nickname, commentDesc }: { nickname: string; commentDesc: string }) => {
  return (
    <div className='flex gap-1'>
      <div>이미지</div>
      <div>
        <span className='font-bold'>{nickname}</span>
        <p>{commentDesc}</p>
      </div>
    </div>
  );
};

export default Comment;
