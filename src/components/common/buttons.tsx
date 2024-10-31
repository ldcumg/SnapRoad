'use client';

import { Button } from '@/stories/Button';
import { Angry } from 'lucide-react';
import React from 'react';

const Buttons = () => {
  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>버튼 예제</h1>

      {/* 큰 버튼 */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>큰 버튼</h2>
        <div className='flex gap-4 p-4'>
          <Button
            type='button'
            variant='primary'
            size='large'
            label='큰 기본 버튼'
            onClick={() => console.log('큰 기본 버튼 클릭')}
          />
          <Button
            type='button'
            variant='secondary'
            size='large'
            label='큰 보조 버튼'
            onClick={() => console.log('큰 보조 버튼 클릭')}
          />
          <Button
            type='button'
            variant='outlinePink'
            size='large'
            label='큰 테두리 버튼'
            onClick={() => console.log('큰 테두리 버튼 클릭')}
          />

          <Button
            type='button'
            variant='outlineGray'
            size='large'
            label='큰 테두리 회색 버튼'
            onClick={() => console.log('큰 테두리 회색 버튼 클릭')}
          />
        </div>
      </div>

      {/* 중간 버튼 */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>중간 버튼</h2>
        <div className='flex gap-4 p-4'>
          <Button
            type='button'
            variant='primary'
            size='medium'
            label='기본 버튼'
            onClick={() => console.log('기본 버튼 클릭')}
          />
          <Button
            type='button'
            variant='secondary'
            size='medium'
            label='보조 버튼'
            onClick={() => console.log('보조 버튼 클릭')}
          />
          <Button
            type='button'
            variant='outlineGray'
            size='medium'
            label='테두리 회색 버튼'
            onClick={() => console.log('테두리 회색 버튼 클릭')}
          />
        </div>
      </div>

      {/* 작은 버튼 */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>작은 버튼</h2>
        <div className='flex gap-4 p-4'>
          <Button
            type='button'
            variant='primary'
            size='small'
            label='작은 기본 버튼'
            onClick={() => console.log('작은 기본 버튼 클릭')}
          />
          <Button
            type='button'
            variant='secondary'
            size='small'
            label='작은 보조 버튼'
            onClick={() => console.log('작은 보조 버튼 클릭')}
          />
          <Button
            type='button'
            variant='outlinePink'
            size='small'
            label='작은 테두리 버튼'
            onClick={() => console.log('작은 테두리 버튼 클릭')}
          />
        </div>
      </div>

      {/* 비활성화 */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>비활성화</h2>
        <div className='flex gap-4 p-4'>
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
        </div>
      </div>

      {/* 아이콘 버튼 */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>아이콘</h2>
        <div className='flex gap-4 p-4'>
          <Button
            type='button'
            variant='primary'
            onMouseEnter={() => console.log('마우스 들어 왔을 때')}
            aria-label='설명'
            label='추가 텍스트'
          >
            <Angry
              size={18}
              className='mr-1'
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Buttons;
