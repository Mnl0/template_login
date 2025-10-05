
import readEnvFdile from './readEnv.js';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
readEnvFdile();


const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

app.use((req,res,next)=>{
  console.info(`request entries: ${req.method} ${req.url}`);
  console.info(`User Agent: ${req.headers['user-agent']}`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
  next(); 
});

app.use(express.json());

// emulacion de base de datos
const users = [];

app.post('/register', async (req, res) => { 
  const { username, password } = req.body;

  if (!username || !password){
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

  const token = jwt.sign({ id: user.id, username: user.username}, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });

});

app.listen(PORT, () => { 
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using JWT_SECRET: ${JWT_SECRET}`);
});