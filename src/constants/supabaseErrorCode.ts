const errorCode: Record<string, string> = {
  invalid_credentials: '유효하지 않는 사용자입니다.',
  user_already_exists: '이미 사용 중인 이메일입니다.',
};

export const getErrorMessage = (code: string) => {
  return errorCode[code] || '알 수 없는 오류가 발생했습니다.';
};
