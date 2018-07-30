const jwt = require("jsonwebtoken");

const User = require("../models/user");

const verifyToken = "jbIUG78hoiknbY&g";

module.exports = {
  addNewUser: (req, res) => {
    const { fullname, email, password } = req.body;
    const user = { fullname, email, password };
    User.findOneOrCreate(user)
      .then(result => {
        res.status(result.status).json({
          message: result.message
        });
      })
      .catch(err => {
        res.status(err.status).json({
          message: err.message
        });
      });
  },

  userLogin: (req, res) => {
    const { email, password } = req.body;
    const candidate = { email, password };

    User.findByEmailThenComparePass(candidate)
      .then(result => {
        const secretKey = verifyToken;
        const payload = {
          id: result.user._id,
          email: result.user.email,
          fullname: result.user.fullname
        };

        const token = jwt.sign(payload, secretKey);

        res.status(result.status).json({
          message: result.message,
          user: {
            fullname: result.user.fullname,
            email: result.user.email,
            courses: {
              practice: result.user.coursePractice
            }
          },
          token
        });
      })
      .catch(err => {
        console.log(err);
        res.status(err.status).json({
          message: err.message
        });
      });
  },

  checkLoginState: async (req, res) => {
    const { user } = res.locals;

    let foundUser = await User.findById(user.id).populate(
      "coursePractice.name"
    );
    if (user) {
      res.status(200).json({
        message: "user logged in",
        user: {
          ...user,
          courses: {
            practice: foundUser.coursePractice
          }
        }
      });
    }
  },

  updatePracticeCourse: async (req, res) => {
    try {
      let { note, score } = req.body
      let { user } = res.locals
      let foundUser = await User.findById(user.id).populate('coursePractice.name')
      foundUser.coursePractice.forEach(course => {
        if (course.name.note === note) {
          course.score = score
        }
      })
      await foundUser.save()
      res.json({message: 'updated'})
    } catch (error) {
      res.status(500).json({error})
    }
  }
};
