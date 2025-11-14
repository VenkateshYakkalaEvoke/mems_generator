import React from 'react';
import './DownloadButton.css';

function DownloadButton({ onDownload }) {
  return (
    <div className="download-section">
      <button
        onClick={onDownload}
        className="download-button"
      >
        Download Meme
      </button>
      <p className="download-hint">
        Your meme will be saved as a PNG image
      </p>
    </div>
  );
}

export default DownloadButton;

