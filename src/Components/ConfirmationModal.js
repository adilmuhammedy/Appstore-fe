import React from 'react';
import './ConfirmationModal.css';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete the apk details?</p>
        <div className='button-container'>
        <div className='confirm' onClick={onConfirm}>
        <PrimaryButton buttonText="Confirm"></PrimaryButton>
        </div>
        <div className='cancel' onClick={onClose}>
        <SecondaryButton buttonText="Cancel" ></SecondaryButton>
        </div>
        </div>

      </div>
    </div>
  );
};

export default ConfirmationModal;
