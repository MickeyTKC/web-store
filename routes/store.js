const express = require("express");
const router = express.Router();
const fileupload = require("express-fileupload");
const fs = require("fs");

const Product = require("../models/Product");
const Store = require("../models/Store");

router.use(fileupload());

const authAdmin = (req, res, next) => {
  const user = req.session.user || {role:"client"}
  const err = {};
  const contentType = req.header("content-type");
  if (!user) {
    err.statusCode = 403;
    err.message = "Permission Required";

  }
  if (user.role != "admin") {
    err.statusCode = 403;
    err.message = "Admin Permission Required";
  }
  if (!contentType){
    res.status(err.statusCode).render("../views/error",{user:user,err:err})
  }
  if(err.statusCode){
    next(err)
  }
  next();
};

const authOperator = (req, res, next) => {
  const err = {};
  if (!req.session.user) {
    err.statusCode = 403;
    err.message = "Permission Required";
    next(err);
  }
  if (req.session.user.role != "operator") {
    err.statusCode = 403;
    err.message = "Admin/Operator Permission Required";
    next(err);
  }
  next();
};

// view store details
router.get("/", async (req, res) => {
  const user = req.session.user || {};
  const storeData = await Store.findOne({});
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("../views/store", { user: user, store: storeData });
});

router.get("/edit", authAdmin, async (req, res) => {
  const user = req.session.user || {};
  const storeData = await Store.findOne({});
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("../views/storeEdit", { user: user, store: storeData });
});



// edit store information
router.put("/", async (req, res) => {
  //store update
  const contentType = req.header("content-type");
  const err = {};
  // get data
  const storeData = await Store.findOne({});
  const uploadImg = req.files.img;
  if (uploadImg)
    imgData = fs.readFileSync(uploadImg.tempFilePath, { encoding: "base64" });
  const store = {
    name: req.body.name,
    img: imgData || "", //store logo
    info: req.body.info || "",
    address: req.body.address,
  };
  console.log(store);
  await Store.updateOne(storeData.storeId, store);
});

router.use((err, req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  // Default error status code
  const statusCode = err.statusCode || 500;
  // Default error message
  const message = err.message || "Internal Server Error";
  // Send error response
  res.status(statusCode).json({ error: message });
});

// Start the server
module.exports = router;
