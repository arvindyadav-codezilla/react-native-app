// EducationFormModal.js
import React from 'react';
import EducationForm from '../../../../../components/organisms/EducationForm';

const EducationFormModal = ({modalVisible, closeModal}) => {
  return (
    modalVisible && (
      <EducationForm isVisible={modalVisible} onClose={() => closeModal()} />
    )
  );
};

export default EducationFormModal;
