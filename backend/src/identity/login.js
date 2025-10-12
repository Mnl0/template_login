import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from './users.js';

export const loginHandler = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
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
};