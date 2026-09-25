// Renders download status and completion details.
import { useEffect, useState } from 'react';
import AdSpace from './AdSpace'; 
import './DownloadPopup.css';

export type DownloadPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onTriggerDownload: () => void;
  itemName?: string;
};

// Renders the download popup interface.
export default function DownloadPopup({ 
  isOpen, 
  onClose, 
  onTriggerDownload, 
  itemName = "File" 
}: DownloadPopupProps) {
  
  const [status, setStatus] = useState<'downloading' | 'completed'>('downloading');

  useEffect(/* Runs side effects when its dependencies change. */ () => {
    if (isOpen) {
      setStatus('downloading');

      const downloadTimer = setTimeout(/* Downloads timer. */ () => {
        setStatus('completed');
        onTriggerDownload();
      }, 3500);

      const autoCloseTimer = setTimeout(/* Handles auto close timer work. */ () => {
        onClose();
      }, 6500);

      return /* Runs side effects when its dependencies change. */ () => {
        clearTimeout(downloadTimer);
        clearTimeout(autoCloseTimer);
      };
    }
  }, [isOpen, onTriggerDownload, onClose]);

  if (!isOpen) return null;

  return (
    <div className="download-popup-overlay">
      <div className="download-popup-container">
        
        <div className="download-popup-header">
          {status === 'downloading' ? (
            <>
              <div className="download-spinner"></div>
              <h3>Preparing your {itemName}...</h3>
              <p>Please wait while we generate your document.</p>
            </>
          ) : (
            <>
              <div className="download-success-icon">✓</div>
              <h3>Download Completed!</h3>
              <p>Your {itemName} has been successfully downloaded.</p>
            </>
          )}
        </div>

        {/* Updated AdSpace Integration */}
        <div className="download-popup-ad-wrapper" style={{ marginBottom: '24px' }}>
          <AdSpace 
            variant="banner" 
            compact={true} 
            label="Advertisement" 
          />
        </div>

        <button 
          className="download-popup-close-btn" 
          onClick={onClose}
        >
          {status === 'downloading' ? 'Cancel' : 'Close'}
        </button>

      </div>
    </div>
  );
}