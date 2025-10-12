import express from 'express';
import readEnvFile from './readEnv.js';

// Import handlers from feature modules
import { registerHandler } from './src/identity/register.js';
import { loginHandler } from './src/identity/login.js';
import { verifyToken } from './src/identity/auth.js';
import { submitCommentHandler } from './src/comments/submit.js';

// Initialize environment variables
readEnvFile();

const app = express();
const PORT = process.env.PORT;

// General Middleware CORS
app.use((req, res, next) => {
  console.info(`request entries: ${req.method} ${req.url}`);
  console.info(`User Agent: ${req.headers['user-agent']}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(express.json());

// --- Routes --- //

// Identity Routes
app.post('/register', registerHandler);
app.post('/login', loginHandler);

// Comments Routes
app.post('/comments', verifyToken, submitCommentHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});