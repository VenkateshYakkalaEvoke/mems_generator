// Authentication logic (signup, login, logout, session management)
let currentUser = null;

// Initialize auth when DB is ready
async function initAuth() {
  const { auth } = await initDB();
  
  // Listen for auth state changes
  auth.onAuthStateChanged((user) => {
    currentUser = user;
    updateUIForAuthState(user);
  });
  
  return auth;
}

// Sign up new user
async function signUp(email, password, username) {
  try {
    const { auth } = await initDB();
    
    // Create user with email and password
    const userCredential = await auth.signUp({
      email: email,
      password: password
    });
    
    // Update user profile with username
    if (userCredential && db) {
      const userId = userCredential.user.id;
      await db.transact(
        db.tx.users[userId].update({ username: username })
      );
    }
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
}

// Sign in existing user
async function signIn(email, password) {
  try {
    const { auth } = await initDB();
    const userCredential = await auth.signIn({
      email: email,
      password: password
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
}

// Sign out
async function signOut() {
  try {
    const { auth } = await initDB();
    await auth.signOut();
    currentUser = null;
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
}

// Get current user
function getCurrentUser() {
  return currentUser;
}

// Update UI based on auth state
function updateUIForAuthState(user) {
  const authSection = document.getElementById('auth-section');
  const createMemeSection = document.getElementById('create-meme-section');
  const userInfo = document.getElementById('user-info');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  
  if (user) {
    // User is logged in
    if (authSection) authSection.style.display = 'none';
    if (createMemeSection) createMemeSection.style.display = 'block';
    if (userInfo) {
      userInfo.style.display = 'block';
      const usernameSpan = userInfo.querySelector('#username-display');
      if (usernameSpan) {
        // Fetch username from DB
        fetchUserUsername(user.id).then(username => {
          usernameSpan.textContent = username || user.email;
        });
      }
    }
  } else {
    // User is not logged in
    if (authSection) authSection.style.display = 'block';
    if (createMemeSection) createMemeSection.style.display = 'none';
    if (userInfo) userInfo.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
  }
}

// Fetch username from database
async function fetchUserUsername(userId) {
  try {
    if (!db) await initDB();
    const query = db.query({ users: { $: { where: { id: userId } } } });
    const users = query.users || [];
    return users[0]?.username || null;
  } catch (error) {
    console.error('Error fetching username:', error);
    return null;
  }
}

// Handle login form submission
window.handleLogin = function(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  signIn(email, password).then(result => {
    if (result.success) {
      showMessage('Login successful!', 'success');
      document.getElementById('login-form').reset();
    } else {
      showMessage('Login failed: ' + result.error, 'error');
    }
  });
}

// Handle signup form submission
window.handleSignup = function(event) {
  event.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const username = document.getElementById('signup-username').value;
  
  if (!username || username.trim() === '') {
    showMessage('Username is required', 'error');
    return;
  }
  
  signUp(email, password, username).then(result => {
    if (result.success) {
      showMessage('Account created successfully!', 'success');
      document.getElementById('signup-form').reset();
      // Switch to login form
      document.getElementById('signup-form').style.display = 'none';
      document.getElementById('login-form').style.display = 'block';
    } else {
      showMessage('Signup failed: ' + result.error, 'error');
    }
  });
}

// Show message to user
function showMessage(message, type) {
  const messageDiv = document.getElementById('auth-message');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `auth-message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  } else {
    alert(message);
  }
}

// Toggle between login and signup forms
window.toggleAuthForm = function() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const toggleLink = document.getElementById('toggle-auth-form');
  
  if (loginForm.style.display === 'none') {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    if (toggleLink) toggleLink.textContent = 'Need an account? Sign up';
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    if (toggleLink) toggleLink.textContent = 'Already have an account? Login';
  }
}

