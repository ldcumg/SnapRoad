'use client';

import { Buttomsheet } from '@/components/ui/buttomsheet';
import Buttons from '@/components/ui/buttons';
import Colors from '@/components/ui/colors';
import Example from '@/components/ui/example';
import Tabs from '@/components/ui/tabs';
import { Tab } from '@/stories/Tab';

const GuidePage = () => {
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
export default GuidePage;
