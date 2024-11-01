export const getSlicedAddress = (address: string | null | undefined) => {
  if (!address) return '주소 없음';
  const splittedAddress = address.trim().split(' ');
  if (splittedAddress.length < 3) return address;
  const slicedAddress = splittedAddress[0] + ' ' + splittedAddress[1];
  return slicedAddress;
};
