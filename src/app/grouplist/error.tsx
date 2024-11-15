'use client';

import ErrorComponent from '@/components/_common/ErrorComponent';
import { ErrorProps } from '@/types/ErrorTypes';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

const Error = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    Sentry.withScope((scope) => {
      //NOTE - 에러 태그 설정이 안됨...
      scope.setTag('assignedTo', 'Sangguk_Jeon');
      scope.setContext('details', {
        ...error,
        pageURL: window.location.href,
      });
      Sentry.captureException(error);
    });
  }, [error]);

  return <ErrorComponent reset={reset} />;
};
export default Error;
