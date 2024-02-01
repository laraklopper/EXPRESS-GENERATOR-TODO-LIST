const jwt = require('jsonwebtoken');

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decode = jwt.verify(token, 'SecretKey', { expiresIn: '12h' });
    req.user = decode;
    next();
  } catch (error) {
    res.status(401).json({
      login: false,
      message: 'Invalid Token',
    });
  }
};

module.export = {
  authenticationToken,
}
