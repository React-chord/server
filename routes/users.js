const express = require("express");

const {
  addNewUser,
  userLogin,
  checkLoginState,
  updatePracticeCourse
} = require("../controllers/usersController");
const auth = require("../helpers/auth");

const router = express.Router();

// POST
router.post("/register", addNewUser);
router.post("/login", userLogin);

// GET
router.get("/status", auth, checkLoginState);

// PUT
router.put("/courses/practice/update", auth, updatePracticeCourse);

module.exports = router;
