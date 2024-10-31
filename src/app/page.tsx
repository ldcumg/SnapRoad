'use client';

import Tabs from '@/components/common/Tabs';
import { Buttomsheet } from '@/components/common/buttomsheet';
import Buttons from '@/components/common/buttons';
import Colors from '@/components/common/colors';
import Example from '@/components/common/example';
import { Tab } from '@/stories/Tab';

const Page = () => {
  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-8'>공통 StoryBook 컴포넌트</h1>
      <Tab
        tabs={[
          {
            label: 'color',
            content: (
              <div>
                <Colors />
              </div>
            ),
            onClick: () => console.log('color'),
          },

          {
            label: 'Button',
            content: (
              <div>
                <Buttons />
              </div>
            ),
            onClick: () => console.log('Button'),
          },
          {
            label: 'Tab',
            content: (
              <div>
                <Tabs />
              </div>
            ),
            onClick: () => console.log('Tab'),
          },
          {
            label: 'BottomSheet',
            content: (
              <div>
                <Buttomsheet />
              </div>
            ),
            onClick: () => console.log('BottomSheet'),
          },
          {
            label: 'example',
            content: (
              <div>
                <Example />
              </div>
            ),
            onClick: () => console.log('example 폴더 복붙해서 편집해서 넣으셔도 되요! 레이아웃 고정되어 있어요!'),
          },
        ]}
      />
    </div>
  );
};

export default Page;
