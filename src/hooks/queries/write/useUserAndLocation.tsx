import { useUserQuery } from '@/hooks/queries/byUse/useUserQuery';
import { usePostDataStore } from '@/stores/write/usePostDataStore';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useUserAndLocation = (groupId: string) => {
  const searchParams = useSearchParams();
  const { setUserData, setLocationData, userId, lat, lng, addressName } = usePostDataStore();

  const latQuery = searchParams.get('lat');
  const lngQuery = searchParams.get('lng');
  const placeQuery = searchParams.get('place');
  const latNumber = latQuery ? parseFloat(latQuery) : undefined;
  const lngNumber = lngQuery ? parseFloat(lngQuery) : undefined;
  const decodedAddressName = placeQuery ? decodeURIComponent(placeQuery) : undefined;

  const { data: user, isLoading, error } = useUserQuery();
  const uploadSessionId = useMemo(() => uuidv4(), []);

  useEffect(() => {
    if (user && groupId && uploadSessionId) {
      setUserData(user.id, groupId, uploadSessionId);
    }

    if (latNumber && lngNumber && decodedAddressName) {
      setLocationData(latNumber, lngNumber, decodedAddressName);
    }
  }, [user, groupId, uploadSessionId, latNumber, lngNumber, decodedAddressName, setUserData, setLocationData]);

  return {
    user,
    userId,
    lat,
    lng,
    addressName,
    isLoading,
    error,
    uploadSessionId,
  };
};

export default useUserAndLocation;
