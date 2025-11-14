# Meme Generator

A modern, feature-rich meme generator built with vanilla HTML, CSS, and JavaScript. Create memes by uploading your own images or selecting from popular meme templates, add multiple customizable text boxes, and download your creations.

## Features

- **Image Selection**: Upload your own images or choose from popular meme templates
- **Multiple Text Boxes**: Add as many text boxes as you want to your meme
- **Text Customization**: 
  - Resize text with a slider (20px - 100px)
  - White text with black border for visibility
  - Drag and drop text boxes to position them
- **Real-time Preview**: See your meme update as you type
- **Download**: Export your meme as a PNG image

## Getting Started

### No Installation Required!

Since this is a vanilla HTML/CSS/JavaScript application, you can run it directly:

1. **Option 1: Open directly in browser**
   - Simply open `index.html` in your web browser
   - Double-click the file or right-click and select "Open with" your preferred browser

2. **Option 2: Use a local server (recommended for CORS)**
   - If you have Python installed:
     ```bash
     python -m http.server 8000
     ```
   - Then open `http://localhost:8000` in your browser
   
   - Or if you have Node.js installed:
     ```bash
     npx http-server
     ```
   - Then open the URL shown in the terminal

## Usage

1. **Select an Image**:
   - Click "Upload Image" to upload your own image
   - Or click on one of the template thumbnails

2. **Add Text**:
   - Click "Add Text Box" to add a new text box
   - Double-click a text box to edit the text
   - Click and drag to move text boxes around
   - Use the font size slider to resize text

3. **Download**:
   - Click "Download Meme" to save your creation as a PNG file

## Project Structure

```
/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # All JavaScript functionality
└── README.md           # This file
```

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- HTML5 Canvas API

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript features
- FileReader API

## License

MIT
