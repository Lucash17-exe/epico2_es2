const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwtSecret';

module.exports = function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.userId,
      username: payload.username
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};