import {useState} from 'react';
import axios from 'axios';
import {
  updateEmail,
  verifyupdateEmailOtp,
} from '../../../services/authServices';
import {storageWrite} from '../../../utils/storageUtils';

const useUpdateEmailHook = () => {
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNewEmailChange = value => setNewEmail(value);
  const handleCurrentPasswordChange = value => setCurrentPassword(value);

  const resetFields = () => {
    setNewEmail('');
    setCurrentPassword('');
  };

  const submitUpdateEmail = async (newEmail, currentPassword) => {
    setIsLoading(true);
    let data = {
      new_email: newEmail,
      password: currentPassword,
    };
    console.log('Submitting data:', data);
    await storageWrite('EditUserPrevious', data);
    try {
      const response = await updateEmail(data);
      console.log('reeeeeeeeee', response);
      await storageWrite('updateEmailData', response?.data);
      return response.data;
    } catch (error) {
      console.error('Error during email update:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [isVerifyModalVisible, setVerifyModalVisible] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const showVerifyModal = data => {
    setResponseData(data);
    setVerifyModalVisible(true);
  };

  const hideVerifyModal = () => {
    setVerifyModalVisible(false);
    setResponseData(null);
    isVerifyModalVisible, responseData, showVerifyModal, hideVerifyModal;
  };
  const clearError = () => {
    setError('');
  };

  return {
    newEmail,
    currentPassword,
    isLoading,
    handleNewEmailChange,
    handleCurrentPasswordChange,
    resetFields,
    submitUpdateEmail,
    error,
    clearError,
  };
};

export default useUpdateEmailHook;
