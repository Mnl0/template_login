import bcrypt from 'bcryptjs';
import { users } from './users.js';

export const registerHandler = async (req, res) => {
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
};