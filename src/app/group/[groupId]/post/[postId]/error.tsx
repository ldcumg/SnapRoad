'use client';

import ErrorComponent from '@/components/_common/ErrorComponent';
import { ErrorProps } from '@/types/ErrorTypes';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

const Error = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return <ErrorComponent reset={reset} />;
};
export default Error;
