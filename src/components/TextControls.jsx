import React from 'react';
import './TextControls.css';

function TextControls({ fontSize, onFontSizeChange, onAddTextBox, textBoxCount }) {
  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize >= 20 && newSize <= 100) {
      onFontSizeChange(newSize);
    }
  };

  return (
    <div className="text-controls">
      <h2>Text Controls</h2>
      
      <div className="control-group">
        <label htmlFor="font-size">
          Font Size: {fontSize}px
        </label>
        <input
          id="font-size"
          type="range"
          min="20"
          max="100"
          value={fontSize}
          onChange={handleFontSizeChange}
          className="font-size-slider"
        />
        <div className="slider-labels">
          <span>20px</span>
          <span>100px</span>
        </div>
      </div>

      <div className="control-group">
        <button
          onClick={onAddTextBox}
          className="add-text-button"
        >
          + Add Text Box
        </button>
        <p className="text-box-count">
          {textBoxCount} text box{textBoxCount !== 1 ? 'es' : ''} active
        </p>
      </div>

      <div className="instructions">
        <p className="instruction-title">Tips:</p>
        <ul>
          <li>Click and drag to move text boxes</li>
          <li>Double-click to edit text</li>
          <li>Click × to remove a text box</li>
        </ul>
      </div>
    </div>
  );
}

export default TextControls;

