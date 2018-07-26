const jwt = require('jsonwebtoken');

const verifyToken = 'jbIUG78hoiknbY&g';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const jwtSecret = verifyToken;
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
