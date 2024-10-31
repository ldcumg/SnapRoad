import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
  onClick?: () => void;
}

interface TabsProps {
  tabs: Tab[];
  variant?: 'default' | 'full';
  size?: 'small' | 'medium' | 'large';
}

export const Tab = ({ tabs, variant = 'default', size = 'medium' }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabContainerStyle = variant === 'full' ? 'w-full' : 'flex space-x-4';
  const tabSizeStyle =
    size === 'small' ? 'text-sm py-2 px-4' : size === 'large' ? 'text-lg py-3 px-5' : 'text-base py-2 px-4';
  const inactiveTabStyle = 'text-gray-500 hover:text-blue-500';
  const activeTabStyle = 'border-b-2 border-blue-500 text-blue-500';

  return (
    <div className='flex flex-col'>
      <div className={`border-b ${tabContainerStyle}`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={cn(tabSizeStyle, activeTab === index ? activeTabStyle : inactiveTabStyle, 'focus:outline-none')}
            onClick={() => {
              setActiveTab(index);
              if (tab.onClick) tab.onClick();
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className='p-4'>{tabs[activeTab].content}</div>
    </div>
  );
};
