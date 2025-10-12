
import readEnvFdile from './readEnv.js';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
readEnvFdile();


const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

app.use((req, res, next) => {
  console.info(`request entries: ${req.method} ${req.url}`);
  console.info(`User Agent: ${req.headers['user-agent']}`);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());

// emulacion de base de datos
const users = [];

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = { id: users.length + 1, username, password: hashedPassword };

  users.push(newUser);
  console.info('User registered:', newUser);

  res.status(201).json({ message: 'User registered successfully' });

});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });

});

app.post('/comments', verifyToken, (req, res) => {
  const { email, comment, rating } = req.body;

  if (!email || !comment || !rating) {
    return res.status(400).json({ message: 'Email, comment, and rating are required' });
  }

  const timestamp = new Date().toISOString();
  const commentLine = `${timestamp},${email},${rating},"${comment.replace(/"/g, '""')}"
`;

  fs.appendFile('comments.txt', commentLine, (err) => {
    if (err) {
      console.error('Error writing to comments.txt:', err);
      return res.status(500).json({ message: 'Failed to save comment' });
    }
    res.status(201).json({ message: 'Comment saved successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using JWT_SECRET: ${JWT_SECRET}`);
});