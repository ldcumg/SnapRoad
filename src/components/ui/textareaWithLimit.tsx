'use client';

import { useState } from 'react';

const TextAreaWithLimit = () => {
  const [text, setText] = useState<string>('');
  const maxLength = 1000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    setText(inputText);
  };

  return (
    <div className='relative'>
      <textarea
        id='description'
        maxLength={maxLength}
        placeholder='추억을 기록할 수 있는 글을 남겨보세요.'
        value={text}
        onChange={handleChange}
        className='w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-2'
      />
      <div className='absolute bottom-2 right-3 text-gray-500'>
        {text.length}/{maxLength}
      </div>
    </div>
  );
};

export default TextAreaWithLimit;
