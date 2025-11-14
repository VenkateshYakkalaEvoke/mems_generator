import React, { useState } from 'react';
import './App.css';
import ImageSelector from './components/ImageSelector';
import MemeCanvas from './components/MemeCanvas';
import TextControls from './components/TextControls';
import DownloadButton from './components/DownloadButton';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [textBoxes, setTextBoxes] = useState([]);
  const [fontSize, setFontSize] = useState(40);
  const [canvasRef, setCanvasRef] = useState(null);

  const handleImageSelect = (imageSrc) => {
    setSelectedImage(imageSrc);
    // Reset text boxes when new image is selected
    setTextBoxes([]);
  };

  const addTextBox = () => {
    const newTextBox = {
      id: Date.now(),
      text: 'Your text here',
      x: 50,
      y: 50,
      fontSize: fontSize
    };
    setTextBoxes([...textBoxes, newTextBox]);
  };

  const removeTextBox = (id) => {
    setTextBoxes(textBoxes.filter(box => box.id !== id));
  };

  const updateTextBox = (id, updates) => {
    setTextBoxes(textBoxes.map(box => 
      box.id === id ? { ...box, ...updates } : box
    ));
  };

  const handleDownload = () => {
    if (canvasRef) {
      canvasRef.downloadMeme();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meme Generator</h1>
        <p>Create your perfect meme with custom text</p>
      </header>
      
      <div className="App-container">
        <div className="sidebar">
          <ImageSelector onImageSelect={handleImageSelect} />
          
          {selectedImage && (
            <>
              <TextControls
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                onAddTextBox={addTextBox}
                textBoxCount={textBoxes.length}
              />
              
              <DownloadButton onDownload={handleDownload} />
            </>
          )}
        </div>

        <div className="canvas-container">
          {selectedImage ? (
            <MemeCanvas
              imageSrc={selectedImage}
              textBoxes={textBoxes}
              fontSize={fontSize}
              onTextBoxUpdate={updateTextBox}
              onRemoveTextBox={removeTextBox}
              setCanvasRef={setCanvasRef}
            />
          ) : (
            <div className="placeholder">
              <p>Select an image to get started</p>
              <p className="placeholder-subtitle">Upload your own or choose a template</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

