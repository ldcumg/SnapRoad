'use client';

import React from 'react';

const Error = ({ error }: { error: Error & { digest?: string } }) => {
  return (
    <div>
      <p>임시 에러페이지</p>
      <p>{JSON.stringify(error)}</p>
    </div>
  );
};

export default Error;
