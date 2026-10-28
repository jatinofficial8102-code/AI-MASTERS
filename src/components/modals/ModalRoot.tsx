import React from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentUploadModal } from './DocumentUploadModal';
import { VerificationModal } from './VerificationModal';
import { EditProfileModal } from './EditProfileModal';
import { RequestVerificationModal } from './RequestVerificationModal';
import { ConsentReviewModal } from './ConsentReviewModal';

export const ModalRoot: React.FC = () => {
  const { activeModal } = useApp();

  if (!activeModal) return null;

  switch (activeModal) {
    case 'upload-document':
      return <DocumentUploadModal />;
    case 'verification-details':
      return <VerificationModal />;
    case 'edit-profile':
      return <EditProfileModal />;
    case 'request-verification':
      return <RequestVerificationModal />;
    case 'review-consent':
      return <ConsentReviewModal />;
    default:
      return null;
  }
};
