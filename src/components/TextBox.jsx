import React, { useState, useRef, useEffect } from 'react';
import './TextBox.css';

function TextBox({ textBox, containerWidth, containerHeight, onUpdate, onRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const boxRef = useRef(null);

  // Convert percentage to pixels
  const left = (textBox.x / 100) * containerWidth;
  const top = (textBox.y / 100) * containerHeight;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'INPUT') return;
    setIsDragging(true);
    const rect = boxRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - (textBox.x / 100) * containerWidth,
      y: e.clientY - rect.top - (textBox.y / 100) * containerHeight
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const containerRect = boxRef.current.parentElement.getBoundingClientRect();
    const x = e.clientX - containerRect.left - dragStart.x;
    const y = e.clientY - containerRect.top - dragStart.y;

    // Convert pixels to percentage
    const percentX = Math.max(0, Math.min(100, (x / containerWidth) * 100));
    const percentY = Math.max(0, Math.min(100, (y / containerHeight) * 100));

    onUpdate({ x: percentX, y: percentY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, containerWidth, containerHeight]);

  const handleTextChange = (e) => {
    onUpdate({ text: e.target.value });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={boxRef}
      className={`text-box ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${textBox.x}%`,
        top: `${textBox.y}%`,
        fontSize: `${textBox.fontSize || 40}px`
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={textBox.text || ''}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-input"
          style={{ fontSize: `${textBox.fontSize || 40}px` }}
        />
      ) : (
        <div className="text-display">
          {textBox.text || 'Your text here'}
        </div>
      )}
      <button
        className="remove-button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        title="Remove text box"
      >
        ×
      </button>
    </div>
  );
}

export default TextBox;

