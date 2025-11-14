import React, { useRef, useEffect, useState } from 'react';
import './MemeCanvas.css';
import TextBox from './TextBox';

function MemeCanvas({ imageSrc, textBoxes, fontSize, onTextBoxUpdate, onRemoveTextBox, setCanvasRef }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [image, setImage] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImage(img);
      // Calculate canvas size maintaining aspect ratio, max 600px width
      const maxWidth = 600;
      const maxHeight = 600;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      setCanvasSize({ width, height });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      // Draw image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Draw text boxes
      textBoxes.forEach(textBox => {
        const text = textBox.text || '';
        const x = (textBox.x / 100) * canvas.width;
        const y = (textBox.y / 100) * canvas.height;
        const size = textBox.fontSize || fontSize;

        ctx.font = `bold ${size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw black stroke (border)
        ctx.strokeStyle = 'black';
        ctx.lineWidth = Math.max(2, size / 20);
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(text, x, y);

        // Draw white fill
        ctx.fillStyle = 'white';
        ctx.fillText(text, x, y);
      });
    }
  }, [image, textBoxes, fontSize, canvasSize]);

  // Expose download function to parent
  useEffect(() => {
    if (setCanvasRef) {
      setCanvasRef({
        downloadMeme: () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const link = document.createElement('a');
            link.download = 'meme.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
          }
        }
      });
    }
  }, [setCanvasRef]);

  if (!image) {
    return <div className="canvas-loading">Loading image...</div>;
  }

  return (
    <div className="meme-canvas-container" ref={containerRef}>
      <div 
        className="canvas-wrapper"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      >
        <canvas
          ref={canvasRef}
          className="meme-canvas"
          width={canvasSize.width}
          height={canvasSize.height}
        />
        {textBoxes.map(textBox => (
          <TextBox
            key={textBox.id}
            textBox={textBox}
            containerWidth={canvasSize.width}
            containerHeight={canvasSize.height}
            onUpdate={(updates) => onTextBoxUpdate(textBox.id, updates)}
            onRemove={() => onRemoveTextBox(textBox.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default MemeCanvas;

