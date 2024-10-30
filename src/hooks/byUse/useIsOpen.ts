import { useState } from 'react';

export const useIsOpen = (initState = false): [boolean, () => void] => {
  const [isOpen, setIsOpen] = useState(initState);
  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };
  return [isOpen, handleIsOpen];
};
