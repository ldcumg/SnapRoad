'use client';

import { Tab } from '@/stories/Tab';
import React from 'react';

const Tabs = () => {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-8'>탭 기능 예제</h1>
      <Tab
        variant='full'
        tabs={[
          {
            label: '탭 1',
            content: <div>탭 1 내용: 여기에 탭 1의 내용을 작성하세요.</div>,
            onClick: () => console.log('탭 1 클릭됨'),
          },
          {
            label: '탭 2',
            content: <div>탭 2 내용: 여기에 탭 2의 내용을 작성하세요.</div>,
            onClick: () => console.log('탭 2 클릭됨'),
          },
          {
            label: '탭 3',
            content: <div>탭 3 내용: 여기에 탭 3의 내용을 작성하세요.</div>,
            onClick: () => console.log('탭 3 클릭됨'),
          },
        ]}
      />
    </div>
  );
};

export default Tabs;
