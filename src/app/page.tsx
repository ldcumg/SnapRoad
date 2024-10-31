'use client';

import Tabs from '@/components/ui/Tabs';
import { Buttomsheet } from '@/components/ui/buttomsheet';
import Buttons from '@/components/ui/buttons';
import Colors from '@/components/ui/colors';
import { Tab } from '@/stories/Tab';

const Page = () => {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>공통 StoryBook 컴포넌트</h1>
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
            content: <div>example</div>,
            onClick: () => console.log('example'),
          },
        ]}
      />
    </div>
  );
};

export default Page;
