// Template images
const TEMPLATE_IMAGES = [
  {
    name: 'Drake',
    url: 'https://i.imgflip.com/30b1gx.jpg'
  },
  {
    name: 'Distracted Boyfriend',
    url: 'https://i.imgflip.com/1ur9b0.jpg'
  },
  {
    name: 'Expanding Brain',
    url: 'https://i.imgflip.com/1jhl7s.jpg'
  },
  {
    name: 'Two Buttons',
    url: 'https://i.imgflip.com/1g8my4.jpg'
  },
  {
    name: 'Change My Mind',
    url: 'https://i.imgflip.com/24y43o.jpg'
  },
  {
    name: 'Woman Yelling at Cat',
    url: 'https://i.imgflip.com/345v97.jpg'
  }
];

// Application state
let selectedImage = null;
let textBoxes = [];
let fontSize = 40;
let currentImage = null;
let canvasSize = { width: 500, height: 500 };
let draggedTextBox = null;
let dragStart = { x: 0, y: 0 };

// DOM elements
const fileUploadInput = document.getElementById('file-upload');
const uploadStatus = document.getElementById('upload-status');
const templatesGrid = document.getElementById('templates-grid');
const placeholder = document.getElementById('placeholder');
const canvasWrapperContainer = document.getElementById('canvas-wrapper-container');
const canvasWrapper = document.getElementById('canvas-wrapper');
const canvas = document.getElementById('meme-canvas');
const textBoxesContainer = document.getElementById('text-boxes-container');
const textControlsSection = document.getElementById('text-controls-section');
const fontSizeSlider = document.getElementById('font-size');
const fontSizeValue = document.getElementById('font-size-value');
const addTextButton = document.getElementById('add-text-button');
const textBoxCount = document.getElementById('text-box-count');
const downloadButton = document.getElementById('download-button');
const postMemeButton = document.getElementById('post-meme-button');

// Initialize templates
function initializeTemplates() {
  templatesGrid.innerHTML = '';
  TEMPLATE_IMAGES.forEach((template, index) => {
    const templateItem = document.createElement('div');
    templateItem.className = 'template-item';
    templateItem.innerHTML = `
      <img src="${template.url}" alt="${template.name}" class="template-thumbnail">
      <p class="template-name">${template.name}</p>
    `;
    templateItem.addEventListener('click', () => {
      handleTemplateSelect(template.url);
    });
    templatesGrid.appendChild(templateItem);
  });
}

// Handle image upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageSrc = reader.result;
      uploadStatus.style.display = 'block';
      handleImageSelect(imageSrc);
    };
    reader.readAsDataURL(file);
  }
}

// Handle template selection
function handleTemplateSelect(templateUrl) {
  uploadStatus.style.display = 'none';
  handleImageSelect(templateUrl);
}

// Handle image selection
function handleImageSelect(imageSrc) {
  selectedImage = imageSrc;
  textBoxes = [];
  currentImage = null;
  
  // Show controls and hide placeholder
  textControlsSection.style.display = 'block';
  placeholder.style.display = 'none';
  canvasWrapperContainer.style.display = 'block';
  
  // Load image
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    currentImage = img;
    
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

    canvasSize = { width, height };
    canvas.width = width;
    canvas.height = height;
    canvasWrapper.style.width = width + 'px';
    canvasWrapper.style.height = height + 'px';
    
    renderCanvas();
    updateTextBoxCount();
  };
  img.onerror = () => {
    alert('Failed to load image. Please try another image.');
  };
  img.src = imageSrc;
}

// Render canvas with image and text
function renderCanvas() {
  if (!currentImage || !canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Draw image
  ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
  
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

// Create text box element
function createTextBoxElement(textBox) {
  const textBoxElement = document.createElement('div');
  textBoxElement.className = 'text-box';
  textBoxElement.dataset.id = textBox.id;
  textBoxElement.style.left = textBox.x + '%';
  textBoxElement.style.top = textBox.y + '%';
  textBoxElement.style.fontSize = (textBox.fontSize || fontSize) + 'px';
  
  const textDisplay = document.createElement('div');
  textDisplay.className = 'text-display';
  textDisplay.textContent = textBox.text || 'Your text here';
  
  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.className = 'text-input';
  textInput.value = textBox.text || '';
  textInput.style.fontSize = (textBox.fontSize || fontSize) + 'px';
  textInput.style.display = 'none';
  
  const removeButton = document.createElement('button');
  removeButton.className = 'remove-button';
  removeButton.innerHTML = '×';
  removeButton.title = 'Remove text box';
  
  textBoxElement.appendChild(textDisplay);
  textBoxElement.appendChild(textInput);
  textBoxElement.appendChild(removeButton);
  
  // Event listeners
  let isEditing = false;
  let isDragging = false;
  
  // Double click to edit
  textBoxElement.addEventListener('dblclick', (e) => {
    if (e.target === removeButton) return;
    isEditing = true;
    textDisplay.style.display = 'none';
    textInput.style.display = 'block';
    textInput.focus();
    textInput.select();
  });
  
  // Text input events
  textInput.addEventListener('blur', () => {
    isEditing = false;
    textDisplay.style.display = 'block';
    textInput.style.display = 'none';
    updateTextBox(textBox.id, { text: textInput.value });
  });
  
  textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      isEditing = false;
      textDisplay.style.display = 'block';
      textInput.style.display = 'none';
      updateTextBox(textBox.id, { text: textInput.value });
    }
  });
  
  textInput.addEventListener('input', () => {
    updateTextBox(textBox.id, { text: textInput.value });
  });
  
  // Drag functionality
  textBoxElement.addEventListener('mousedown', (e) => {
    if (e.target === textInput || e.target === removeButton) return;
    if (isEditing) return;
    
    isDragging = true;
    draggedTextBox = textBoxElement;
    textBoxElement.classList.add('dragging');
    
    const rect = textBoxElement.getBoundingClientRect();
    const containerRect = canvasWrapper.getBoundingClientRect();
    dragStart = {
      x: e.clientX - containerRect.left - (textBox.x / 100) * canvasSize.width,
      y: e.clientY - containerRect.top - (textBox.y / 100) * canvasSize.height
    };
    
    e.preventDefault();
  });
  
  // Remove button
  removeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    removeTextBox(textBox.id);
  });
  
  return textBoxElement;
}

// Update text boxes in DOM
function updateTextBoxesDOM() {
  textBoxesContainer.innerHTML = '';
  textBoxes.forEach(textBox => {
    const element = createTextBoxElement(textBox);
    textBoxesContainer.appendChild(element);
  });
}

// Add text box
function addTextBox() {
  const newTextBox = {
    id: Date.now(),
    text: 'Your text here',
    x: 50,
    y: 50,
    fontSize: fontSize
  };
  textBoxes.push(newTextBox);
  updateTextBoxesDOM();
  renderCanvas();
  updateTextBoxCount();
}

// Remove text box
function removeTextBox(id) {
  textBoxes = textBoxes.filter(box => box.id !== id);
  updateTextBoxesDOM();
  renderCanvas();
  updateTextBoxCount();
}

// Update text box
function updateTextBox(id, updates) {
  const textBox = textBoxes.find(box => box.id === id);
  if (textBox) {
    Object.assign(textBox, updates);
    renderCanvas();
    
    // Update DOM element if it exists
    const element = textBoxesContainer.querySelector(`[data-id="${id}"]`);
    if (element) {
      if (updates.x !== undefined || updates.y !== undefined) {
        element.style.left = textBox.x + '%';
        element.style.top = textBox.y + '%';
      }
      if (updates.fontSize !== undefined) {
        element.style.fontSize = textBox.fontSize + 'px';
        const input = element.querySelector('.text-input');
        if (input) input.style.fontSize = textBox.fontSize + 'px';
      }
      if (updates.text !== undefined) {
        const display = element.querySelector('.text-display');
        if (display) display.textContent = textBox.text || 'Your text here';
      }
    }
  }
}

// Update font size
function updateFontSize(newSize) {
  fontSize = newSize;
  fontSizeValue.textContent = fontSize;
  
  // Update existing text boxes that don't have custom fontSize
  textBoxes.forEach(textBox => {
    if (!textBox.fontSize) {
      textBox.fontSize = fontSize;
    }
  });
  
  updateTextBoxesDOM();
  renderCanvas();
}

// Update text box count
function updateTextBoxCount() {
  const count = textBoxes.length;
  textBoxCount.textContent = `${count} text box${count !== 1 ? 'es' : ''} active`;
}

// Download meme
function downloadMeme() {
  if (!canvas) return;
  
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Post meme to gallery
async function postMemeToGallery() {
  if (!canvas) {
    showPostMessage('Please create a meme first', 'error');
    return;
  }
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    showPostMessage('You must be logged in to post memes', 'error');
    return;
  }
  
  try {
    // Convert canvas to base64
    const imageData = canvas.toDataURL('image/png');
    
    // Post to gallery using gallery.js function
    const result = await postMeme(imageData);
    
    if (result.success) {
      showPostMessage('Meme posted successfully!', 'success');
      // Optionally switch to gallery view
      setTimeout(() => {
        showGallery();
      }, 1500);
    }
  } catch (error) {
    console.error('Error posting meme:', error);
    showPostMessage('Failed to post meme: ' + error.message, 'error');
  }
}

// Show post message
function showPostMessage(message, type) {
  const messageDiv = document.getElementById('post-message') || document.createElement('div');
  messageDiv.id = 'post-message';
  messageDiv.className = `post-message ${type}`;
  messageDiv.textContent = message;
  messageDiv.style.display = 'block';
  
  // Insert after post button if it exists
  if (postMemeButton && !document.getElementById('post-message')) {
    postMemeButton.parentNode.insertBefore(messageDiv, postMemeButton.nextSibling);
  }
  
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

// Global mouse move handler for dragging
document.addEventListener('mousemove', (e) => {
  if (!draggedTextBox) return;
  
  const containerRect = canvasWrapper.getBoundingClientRect();
  const x = e.clientX - containerRect.left - dragStart.x;
  const y = e.clientY - containerRect.top - dragStart.y;
  
  // Convert pixels to percentage
  const percentX = Math.max(0, Math.min(100, (x / canvasSize.width) * 100));
  const percentY = Math.max(0, Math.min(100, (y / canvasSize.height) * 100));
  
  const textBoxId = parseInt(draggedTextBox.dataset.id);
  updateTextBox(textBoxId, { x: percentX, y: percentY });
});

// Global mouse up handler
document.addEventListener('mouseup', () => {
  if (draggedTextBox) {
    draggedTextBox.classList.remove('dragging');
    draggedTextBox = null;
  }
});

// Event listeners
fileUploadInput.addEventListener('change', handleFileUpload);
fontSizeSlider.addEventListener('input', (e) => {
  const newSize = parseInt(e.target.value, 10);
  if (!isNaN(newSize) && newSize >= 20 && newSize <= 100) {
    updateFontSize(newSize);
  }
});
addTextButton.addEventListener('click', addTextBox);
downloadButton.addEventListener('click', downloadMeme);
if (postMemeButton) {
  postMemeButton.addEventListener('click', postMemeToGallery);
}

// Initialize app
initializeTemplates();

