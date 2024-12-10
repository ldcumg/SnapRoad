import React from 'react';

const AgreeList = () => {
  return (
    <div>
      <span className='text-label_md text-gray-900'>[필수] 개인정보 수집 및 이용에 대한 동의 </span>
      <br />
      <br />
      <div>
        <span className='text-body_sm text-gray-900'>
          1. 수집하는 개인정보 항목회원가입 및 서비스 이용을 위해 다음과 같은 개인정보를 수집합니다.
        </span>
        <br />
        <span className='text-label_sm text-gray-700'>- 필수 정보 : 이메일 주소, 비밀번호</span>
        <br />
        <br />
      </div>

      <div>
        <span className='text-body_sm text-gray-900'>2. 개인정보 수집 및 이용 목적</span> <br />
        <span className='text-body_sm text-gray-900'>수집한 개인정보는 다음 목적을 위해 사용됩니다</span> <br />
        <span className='text-label_sm text-gray-700'>- 회원가입 의사 확인 및 회원 식별</span>
      </div>
      <br />
      <div>
        <span className='text-body_sm text-gray-900'>3. 개인정보 보유 및 이용 기간</span> <br />
        <span className='text-body_sm text-gray-900'>
          원칙적으로, 개인정보는 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 다만, 아래의 정보는
          명시한 기간 동안 보관됩니다.
        </span>
        <br />
        <span className='text-label_sm text-gray-700'>- 회원가입 및 관리 : 회원 탈퇴 시까지 보유</span>
      </div>
      <br />
      <div>
        <span className='text-body_sm text-gray-900'>4. 개인정보의 파기 절차 및 방법</span>
        <br />
        <span className='text-body_sm text-gray-900'>
          원칙적으로, 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. <br /> 전자적 파일
          형태의 정보는 기록을 재생할 수 없느니술적 방법을 사용하여 삭제합니다. <br /> 종이에 출력된 정보는 분쇄기로
          분쇄하거나 속하여 파기합니다.
        </span>
      </div>
    </div>
  );
};

export default AgreeList;
