// Gallery functionality and meme fetching/display
let memesSubscription = null;

// Initialize gallery
async function initGallery() {
  await initDB();
  loadMemes();
}

// Load memes from database
window.loadMemes = async function() {
  if (!db) {
    await initDB();
  }
  
  try {
    // Query all memes with user information, ordered by creation date
    const query = db.query({
      memes: {
        $: {
          where: {},
          order: { createdAt: 'desc' }
        },
        user: {},
        id: {},
        imageData: {},
        createdAt: {},
        likes: {}
      }
    });
    
    // Subscribe to real-time updates
    if (memesSubscription) {
      memesSubscription.unsubscribe();
    }
    
    memesSubscription = db.subscribe(query, (data) => {
      displayMemes(data.memes || []);
    });
  } catch (error) {
    console.error('Error loading memes:', error);
  }
}

// Display memes in gallery
function displayMemes(memes) {
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer) return;
  
  if (memes.length === 0) {
    galleryContainer.innerHTML = '<div class="no-memes">No memes yet. Be the first to post one!</div>';
    return;
  }
  
  galleryContainer.innerHTML = '';
  
  memes.forEach(meme => {
    const memeCard = createMemeCard(meme);
    galleryContainer.appendChild(memeCard);
  });
}

// Create a meme card element
function createMemeCard(meme) {
  const card = document.createElement('div');
  card.className = 'meme-card';
  card.dataset.memeId = meme.id;
  
  // Format date
  const date = new Date(meme.createdAt);
  const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Get username - handle both object reference and direct user data
  let username = 'Anonymous';
  if (meme.user) {
    if (typeof meme.user === 'object' && meme.user.username) {
      username = meme.user.username;
    } else if (typeof meme.user === 'object' && meme.user.email) {
      username = meme.user.email;
    } else if (typeof meme.user === 'string') {
      // If it's a user ID reference, we'd need to fetch it
      username = 'User';
    }
  }
  
  card.innerHTML = `
    <div class="meme-image-container">
      <img src="${meme.imageData}" alt="Meme" class="meme-image" />
    </div>
    <div class="meme-info">
      <div class="meme-author">By ${username}</div>
      <div class="meme-date">${formattedDate}</div>
      <div class="meme-actions">
        <button class="like-button" onclick="likeMeme('${meme.id}')">
          <span class="like-icon">❤️</span>
          <span class="like-count">${meme.likes || 0}</span>
        </button>
      </div>
    </div>
  `;
  
  return card;
}

// Like a meme
window.likeMeme = async function(memeId) {
  try {
    if (!db) await initDB();
    
    // Get current meme
    const query = db.query({
      memes: {
        $: { where: { id: memeId } }
      }
    });
    
    // Wait for query result
    const memes = query.memes || [];
    if (memes.length === 0) {
      console.error('Meme not found');
      return;
    }
    
    const currentLikes = memes[0].likes || 0;
    
    // Update likes count
    await db.transact(
      db.tx.memes[memeId].update({ likes: currentLikes + 1 })
    );
  } catch (error) {
    console.error('Error liking meme:', error);
  }
}

// Post a meme to the gallery
async function postMeme(imageData) {
  try {
    if (!db) await initDB();
    if (!auth || !auth.user) {
      showMessage('You must be logged in to post memes', 'error');
      return { success: false, error: 'Not authenticated' };
    }
    
    const userId = auth.user.id;
    
    // Create meme in database
    await db.transact(
      db.tx.memes[db.id()].update({
        imageData: imageData,
        userId: userId,
        createdAt: Date.now(),
        likes: 0
      })
    );
    
    showMessage('Meme posted successfully!', 'success');
    return { success: true };
  } catch (error) {
    console.error('Error posting meme:', error);
    showMessage('Failed to post meme: ' + error.message, 'error');
    return { success: false, error: error.message };
  }
}

// Show message (reuse from auth.js or create here)
function showMessage(message, type) {
  const messageDiv = document.getElementById('gallery-message') || document.getElementById('auth-message');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  } else {
    alert(message);
  }
}

