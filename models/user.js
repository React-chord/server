const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
      message: '{VALUE} is not a valid email',
    },
    unique: true,
  },
  password: String,
});

userSchema.statics.findOneOrCreate = async function findOneOrCreate(user) {
  const { email, password, fullname } = user;

  try {
    const foundUser = await this.findOne().where({ email });
    if (foundUser) {
      const error = {
        status: 400,
        message: 'user with this email already exist',
      };
      throw error;
    } else {
      const hash = bcrypt.hashSync(password, 10);
      const newUser = await this.create({
        fullname,
        email,
        password: hash,
      });
      delete newUser.password;
      const success = {
        status: 201,
        message: 'new user created',
      };
      return success;
    }
  } catch (error) {
    if (error.status) {
      throw error;
    }
    console.log('mongodb error', error);
    const newError = {
      status: 500,
      message: "something's wrong when fetching your data",
    };
    throw newError;
  }
};

userSchema.statics.findByEmailThenComparePass = async function findUser(user) {
  const { email, password } = user;
  try {
    const isFound = await this.findOne().where({ email });
    if (!isFound) {
      const error = {
        status: 400,
        message: "user with this email doesn't exist",
      };
      throw error;
    } else {
      const isMatch = bcrypt.compareSync(password, isFound.password);
      if (!isMatch) {
        const error = {
          status: 400,
          message: 'email and password do not match',
        };
        throw error;
      }
      const foundUser = { ...isFound._doc };
      delete foundUser.password;

      const success = {
        status: 200,
        message: 'user logged in',
        user: foundUser,
      };
      return success;
    }
  } catch (error) {
    if (error.status) {
      throw error;
    }
    console.log('mongodb error', error);
    const newError = {
      status: 500,
      message: "something's wrong when fetching your data",
    };
    throw newError;
  }
};

module.exports = mongoose.model('User', userSchema);
