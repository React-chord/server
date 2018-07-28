const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = {
  addNewUser: (req, res) => {
    const { fullname, email, password } = req.body;
    const user = { fullname, email, password };
    User.findOneOrCreate(user)
      .then((result) => {
        res.status(result.status).json({
          message: result.message,
        });
      })
      .catch((err) => {
        res.status(err.status).json({
          message: err.message,
        });
      });
  },

  userLogin: (req, res) => {
    const { email, password } = req.body;
    const candidate = { email, password };

    User.findByEmailThenComparePass(candidate)
      .then((result) => {
        const secretKey = process.env.JWT_SECRET;
        const payload = {
          id: result.user._id,
          email: result.user.email,
          fullname: result.user.fullname
        };

        const token = jwt.sign(payload, secretKey);

        res.status(result.status).json({
          message: result.message,
          user: result.user.fullname,
          token,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(err.status).json({
          message: err.message,
        });
      });
  },

  checkLoginState: (req, res) => {
    const { user } = res.locals;
    if (user) {
      res.status(200).json({ message: 'user logged in', user });
    }
  },
};
