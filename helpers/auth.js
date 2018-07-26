const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const jwtSecret = process.env.JWT_SECRET;
  try {
    const decoded = jwt.verify(authorization, jwtSecret);

    if (decoded) {
      res.locals.user = decoded;
      return next();
    }
    return res.status(401).json({ message: 'please login first' });
  } catch (error) {
    return res.status(500).json({ message: 'unexpected error happen', error });
  }
};
