// Initialize Instant DB module
// This file loads Instant DB and makes it available globally
import { init } from 'https://cdn.jsdelivr.net/npm/@instantdb/js@latest/dist/index.js';

// Make InstantDB available globally for non-module scripts
window.InstantDB = { init };

// Also export for module usage
export { init };

