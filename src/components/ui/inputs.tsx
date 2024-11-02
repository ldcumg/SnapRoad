'use client';

import { Input } from '@/stories/Input';

const Inputs = () => {
  return (
    <div className='colors'>
      <div className='p-8'>
        <h1 className='text-2xl font-bold mb-8'>입력 필드</h1>
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <Input
              label='기본 입력'
              placeholder='텍스트를 입력하세요...'
              variant='primary'
              helperText='이것은 기본 입력입니다'
            />
          </div>
          <div>
            <Input
              label='위험 입력'
              placeholder='텍스트를 입력하세요...'
              variant='danger'
              helperText='이것은 위험 입력입니다'
            />
          </div>
          <div>
            <Input
              label='핑크 테두리 입력'
              placeholder='텍스트를 입력하세요...'
              variant='outlinePink'
              helperText='이것은 핑크 테두리 입력입니다'
            />
          </div>
          <div>
            <Input
              label='비활성화'
              placeholder='텍스트를 입력하세요...'
              variant='outlineGray'
              helperText='이것은 비활성화 입력입니다'
              disabled
            />
          </div>
          <div>
            <Input
              label='기본 입력'
              placeholder='텍스트를 입력하세요...'
              variant='default'
              helperText='이것은 기본 입력입니다'
            />
          </div>
          <div>
            <Input
              label='삭제 버튼 있는 입력'
              placeholder='텍스트를 입력하세요...'
              onDeleteClick={() => console.log('삭제 버튼 클릭됨')}
              helperText='이 입력 필드에는 삭제 버튼이 있습니다'
            />
          </div>

          <div>
            <Input
              label='비밀번호 깜빡이'
              type='password'
              placeholder='비밀번호를 입력하세요...'
              onDeleteClick={() => console.log('삭제 버튼 클릭됨')}
              helperText='비밀번호를 입력하고 보기 버튼을 눌러 확인하세요'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inputs;
