import React from 'react';

const AuthCodeErrorPage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>인증 오류</h1>
      <p>인증 처리 중 문제가 발생했습니다. 다시 시도하시거나 고객 지원에 문의해주세요.</p>
      <a href='/'>홈으로 돌아가기</a>
    </div>
  );
};

export default AuthCodeErrorPage;
