const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CoursePractice = require('./coursePractice')

const { Schema } = mongoose;

const userSchema = new Schema({
  fullname: String,
  email: {
    type: String,
    validate: {
      validator(v) {
        const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(v);
      },
      message: "{VALUE} is not a valid email"
    },
    unique: true
  },
  password: String,
  coursePractice: [
    {
      name: {
        type: Schema.Types.ObjectId,
        ref: "coursePractice"
      },
      score: {
        type: Number,
        default: 0
      }
    }
  ]
});

userSchema.statics.findOneOrCreate = async function findOneOrCreate(user) {
  const { email, password, fullname } = user;

  try {
    const foundUser = await this.findOne().where({ email });
    if (foundUser) {
      const error = {
        status: 400,
        message: "user with this email already exist"
      };
      throw error;
    } else {
      const hash = bcrypt.hashSync(password, 10);
      let coursePractice = await CoursePractice.find()
      let makeArrObj = coursePractice.map(note => note = {name: note._id})
      console.log(makeArrObj)
      const newUser = await this.create({
        fullname,
        email,
        password: hash,
        coursePractice: makeArrObj
      });
      console.log('bikin user', newUser)
      delete newUser.password;
      const success = {
        status: 201,
        message: "new user created"
      };
      return success;
    }
  } catch (error) {
    if (error.status) {
      throw error;
    }
    console.log("mongodb error", error);
    const newError = {
      status: 500,
      message: "something's wrong when fetching your data"
    };
    throw newError;
  }
};

userSchema.statics.findByEmailThenComparePass = async function findUser(user) {
  const { email, password } = user;
  try {
    const isFound = await this.findOne()
      .where({ email })
      .populate("coursePractice.name")
      .populate('practices')

    console.log("ketemu ===============>", isFound);
    if (!isFound) {
      const error = {
        status: 400,
        message: "user with this email doesn't exist"
      };
      throw error;
    } else {
      const isMatch = bcrypt.compareSync(password, isFound.password);
      if (!isMatch) {
        const error = {
          status: 400,
          message: "email and password do not match"
        };
        throw error;
      }
      const foundUser = isFound;
      foundUser.password = null
      console.log('password omited', foundUser.coursePractice[0].name)
      const success = {
        status: 200,
        message: "user logged in",
        user: foundUser
      };
      return success;
    }
  } catch (error) {
    if (error.status) {
      throw error;
    }
    console.log("mongodb error", error);
    const newError = {
      status: 500,
      message: "something's wrong when fetching your data"
    };
    throw newError;
  }
};

module.exports = mongoose.model("User", userSchema);
