const express = require("express");
const router = express.Router();
const User = require("../models/User");

// the auth for permission request
const auth = (req, res, next) => {
  const err = {};
  if (!req.session.user) {
    err.statusCode = 403
    err.message="Permission Required";
    next(err)
  }
  if (req.session.user.role != "admin") {
    err.statusCode = 403
    err.message="Admin Permission Required";
    next(err)
  }
  next();
};

// get user request for user view all user
router.get("/", auth, async (req, res) => {
  const contentType = req.header("content-type");
  const users = await User.find();
  // contentType handling
  if (contentType == "application/json") {
    res.send(JSON.stringify(users));
  } else {
    res.render("../views/users.ejs", { users: users });
  }
});

// get user request by id
router.get("/id/:id", async (req, res) => {
  const contentType = req.header("content-type");
  const id = req.params.id;
  const user = await User.findByUserId(id);
  console.log(user);
  const self = req.session.user;
  // Error handling
  const err = {};
  // contentType handling
  if (contentType == "application/json") {
    if (!user) {
      err.message = "User does not exist.";
      res.send(err);
      return;
    }
    res.send(JSON.stringify(user));
  } else {
    res.render("../views/user.ejs", { user: user, self: self });
  }
});

// post user request for add new user
router.post("/", auth, async (req, res) => {
  // get request data
  const user = {
    userId: req.body.userId,
    password: req.body.password,
    role: req.body.role,
    name: req.body.name,
    info: req.body.info || "",
    address: req.body.address || "",
    email: req.body.email || "",
    phoneNo: req.body.phoneNo || "",
  };
  // err handling
  const err = {};
  // wrong input handlng
  if (!user.userId || !user.password || !user.role || !user.name) {
    res.setHeader("Content-Type", "application/json");
    err.message = "Wrong User Input";
    res.send(JSON.stringify(err));
    return;
  }
  // get user data from db for checking
  const isExist = User.findById(user.userId);
  // user id already exists handling
  if (isExist) {
    res.setHeader("Content-Type", "application/json");
    err.message = "UserId already exists!";
    res.send(JSON.stringify(err));
    return;
  }
  // sign up a new client role user
  if (!isExist) {
    const client = await User.create(user);
    // add Cart 
    if (!client) {
      res.setHeader("Content-Type", "application/json");
      err.message = "Database Error";
      res.send(JSON.stringify(err));
    }
    res.redirect("/");
  }
});

// put user request for edit new user
router.put("/id/:id", auth, async(req, res)=>{
  console.log("Edit User Infomation");
})

router.delete("/id/:id", auth, async(req, res)=>{
  console.log("Edit User Infomation");
})

router.use((err, req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  // Default error status code
  const statusCode = err.statusCode || 500;
  // Default error message
  const message = err.message || 'Internal Server Error';
  // Send error response
  res.status(statusCode).json({ error: message });
});

// Start the server
module.exports = router;
