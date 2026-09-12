import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="confirm-modal-backdrop" onClick={onCancel}>
      <div
        className="confirm-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="confirm-close-btn" onClick={onCancel} aria-label="Close">
          <X size={18} />
        </button>

        <div className="confirm-icon-wrap">
          <AlertTriangle size={32} className="warning-icon" />
        </div>

        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button className="confirm-btn primary-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
          <button className="confirm-btn secondary-confirm" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
