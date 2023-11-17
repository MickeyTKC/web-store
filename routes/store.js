const express = require("express");
const router = express.Router();
const fileupload = require("express-fileupload");

const Product = require("../models/Product")
const Store = require("../models/Store")

app.use(fileupload());
const authAdmin = (req, res, next) => {
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

const authOperator = (req, res, next) => {
  const err = {};
  if (!req.session.user) {
    err.statusCode = 403
    err.message="Permission Required";
    next(err)
  }
  if (req.session.user.role != "operator") {
    err.statusCode = 403
    err.message="Admin/Operator Permission Required";
    next(err)
  }
  next();
};


// view store details
router.get("/", (req, res) => {});

// edit store information 
router.put("/",authAdmin, async (req, res) =>{
    
    //store update
    const contentType = req.header("content-type");
    const err = {};
    // get data
    const storeData = await Store.findOne({});
    const store = {
      name: req.body.name,
      img: req.body.img, //store logo
      info: req.body.info,
      address: req.body.address
    };
    console.log(store);
    ///await Store.findOneAndUpdate({productId:req.body.product},product);
    await Store.updateOne(storeData.storeId, store);
});

// create a new store product
router.post("/product",authOperator,(req, res) =>{
  //check operator
  //store update 
  //product create
})
// edit store product
router.put("/product/id/:id",authOperator,(req, res) =>{
  //check operator
  //product update
})

router.delete("/productt/id/:id",authOperator,(req, res)=>{
  //check operator
  //store update 
  //product delete
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
