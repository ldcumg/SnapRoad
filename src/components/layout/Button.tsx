'use client';

import { Button } from '@/stories/Button';
import { Angry } from 'lucide-react';
import React from 'react';

const ButtonExamples = () => {
  return (
    <div className='flex flex-col items-center gap-4 p-8'>
      <h1 className='text-2xl font-bold mb-4'>버튼 예제</h1>

      <Button
        type='button'
        variant='primary'
        label='기본 버튼'
        onClick={() => console.log('기본 버튼 클릭')}
      />

      <Button
        type='button'
        variant='secondary'
        label='보조 버튼'
        onClick={() => console.log('보조 버튼 클릭')}
      />

      <Button
        type='button'
        variant='outlinePink'
        label='테두리 보조 버튼'
        onClick={() => console.log('테두리 보조 버튼 클릭')}
      />

      <Button
        type='button'
        variant='outlineGray'
        label='테두리 회색 버튼'
        onClick={() => console.log('테두리 회색 버튼 클릭')}
      />

      <Button
        type='button'
        variant='primary'
        size='large'
        label='큰 기본 버튼'
        onClick={() => console.log('큰 기본 버튼 클릭')}
      />

      <Button
        type='button'
        variant='primary'
        size='medium'
        label='기본 버튼'
        onClick={() => console.log('기본 버튼 클릭')}
      />

      <Button
        type='button'
        variant='primary'
        size='small'
        label='작은 기본 버튼'
        onClick={() => console.log('작은 기본 버튼 클릭')}
      />

      <Button
        type='button'
        variant='primary'
        label='비활성화 기본 버튼'
        disabled={true}
      />

      <Button
        type='button'
        variant='secondary'
        label='비활성화 보조 버튼'
        disabled={true}
      />

      <Button
        type='button'
        variant='primary'
        label='로딩 중...'
        loading={true}
      />

      <Button
        type='button'
        variant='secondary'
        label='로딩 중...'
        loading={true}
      />

      <h1 className='text-2xl font-bold mb-4'>아이콘이 포함된 버튼 예제</h1>

      <Button
        type='button'
        variant='primary'
        onMouseEnter={() => console.log('마우스 들어 왔을때 ')}
        aria-label='설명'
        label='추가 텍스트'
      >
        <Angry
          size={18}
          className='mr-1'
        />
      </Button>
    </div>
  );
};

export default ButtonExamples;
