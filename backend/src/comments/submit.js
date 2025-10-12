import fs from 'fs';

export const submitCommentHandler = (req, res) => {
  const { email, comment, rating } = req.body;

  if (!email || !comment || !rating) {
    return res.status(400).json({ message: 'Email, comment, and rating are required' });
  }

  const timestamp = new Date().toISOString();
  const commentLine = `${timestamp},${email},${rating},"${comment.replace(/"/g, '""')}"\n`;

  fs.appendFile('comments.csv', commentLine, (err) => {
    if (err) {
      console.error('Error writing to comments.csv:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(201).json({ message: 'Comment submitted successfully' });
  });
};