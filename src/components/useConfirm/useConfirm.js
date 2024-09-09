import { useState, useCallback } from 'react';

const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationOptions, setConfirmationOptions] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const openConfirm = useCallback(({ title, message, onConfirm, onCancel }) => {
    setConfirmationOptions({
      title,
      message,
      onConfirm,
      onCancel,
    });
    setIsOpen(true);
  }, []);

  const closeConfirm = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    confirmationOptions,
    openConfirm,
    closeConfirm,
  };
};

export default useConfirm;
