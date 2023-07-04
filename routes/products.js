const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth")
const { ProductModel, validateProduct } = require("../models/productModel")
const router = express.Router();

// router.get("/" , async(req,res)=> {
//   let perPage = req.query.perPage || 10;
//   let page = req.query.page || 1;

//   try{
//     let data = await ProductModel.find({})
//     .limit(perPage)
//     .skip((page - 1) * perPage)
//     .sort({_id:-1})
//     res.json(data);
//   }
//   catch(err){
//     console.log(err);
//     res.status(500).json({msg:"there error try again later",err})
//   }
// })

// GET למנהל יציג מוצרים מכל רק מוצרים עם סטטוס 0
router.get("/allProductsAdmin", authAdmin, async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;

  try {
    let data = await ProductModel.find({ status: 0 })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

// GET מציג למוכר את כל המוצרים שלו
router.get("/allProductsUser/:userId", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let userId = req.params.userId;

  try {
    let data = await ProductModel.find({ user_id: userId })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
})

// router.get("/allProductsUser", auth, async (req, res) => {
//   let perPage = req.query.perPage || 10;
//   let page = req.query.page || 1;
//   let editId = req.params.editId;
//   let products = await ProductModel.find({ _id: editId });
//   if(req.tokenData.id){

//   }

//   try {
//     let data = await ProductModel.find({user_id:userId})
//       .limit(perPage)
//       .skip((page - 1) * perPage)
//       .sort({ _id: -1 })
//     res.json(data);
//   }
//   catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "err", err });
//   }
// })

// get הצגת מוצרים מסטטוס 1 לקונים
router.get("/", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;

  try {
    let data = await ProductModel.find({ status: 1 })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

// חיפוש לפי שם המוצר או לפי תיאור המוצר
router.get("/search", async (req, res) => {
  try {
    let queryS = req.query.s;

    let searchReg = new RegExp(queryS, "i")
    let data = await ProductModel.find({ $or: [{ name: { $regex: searchReg } }, { info: { $regex: searchReg } }] })
      .limit(50)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

// הצגת מוצר לפי id
router.get("/single/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let data = await ProductModel.findOne({ _id: id });
    res.json(data)
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
})


router.get("/count", async(req,res) => {
  try{
    // .countDocument -> מחזיר את המספר רשומות שקיימים במסד
    let count = await ProductModel.countDocuments({})
    res.json({count});
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

// עדכון המנהל מסטטוס 0 לסטטוס 1
router.patch("/changeStatusAdmin/:productID", authAdmin, async (req, res) => {
  // if (!req.body.status) {
  //   return res.status(400).json({ msg: "Need to send status in body" });
  // }
  // if(req.body.status != 0){
  //   return res.status(400).json({ msg: "Need to be status = 0" });
  // }

  try {
    let productID = req.params.productID;
    let data = await ProductModel.updateOne({ _id: productID }, { status: 1 })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// עדכון מוכר על סיום הצהרה
// שינוי סטטוס ל2
router.patch("/changeStatusUser/:productID", async (req, res) => {
  // if (!req.body.status) {
  //   return res.status(400).json({ msg: "Need to send status in body" });
  // }
  // if(req.body.status != 1){
  //   return res.status(400).json({ msg: "Need to be status = 1" });
  // }

  try {
    let productID = req.params.productID;
    let data = await ProductModel.updateOne({ _id: productID }, { status: 2 })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// הוספת מוצר
router.post("/", auth, async (req, res) => {
  let validBody = validateProduct(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let product = new ProductModel(req.body);
    product.user_id = req.tokenData._id;
    await product.save();
    res.status(201).json(product);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

// עדכון הצעת מחיר
// router.post("/",async(req,res) => {
//   let validBody = validateProduct(req.body);
//   if(validBody.error){
//     return res.status(400).json(validBody.error.details);
//   }
//   try{
//     let product = new ProductModel(req.body);
//     // product.user_id = req.tokenData._id;
//     await product.save();
//     res.status(201).json(product);
//   }
//   catch(err){
//     console.log(err);
//     res.status(500).json({msg:"there error try again later",err})
//   }
// })

// עריכה של מוצר 
// בתנאי שסטטוס 0
router.put("/:editId", auth, async (req, res) => {
  let validBody = validateProduct(req.body);
  let editId = req.params.editId;
  let product = await ProductModel.findOne({ _id: editId });

  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  if (product.status != 0) {
    return res.status(500).json({ msg: "there error try again later" });
  }
  try {
    let data;
    if (req.tokenData.role == "admin") {
      data = await ProductModel.updateOne({ _id: editId }, req.body);
    }
    else {
      data = await ProductModel.updateOne({ _id: editId, user_id: req.tokenData._id }, req.body)
    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

// עריכה של הצעה מובילה
// בתנאי שסטטוס 1
router.put("/TopOffer/:editId", async (req, res) => {
  let validBody = validateProduct(req.body);
  let editId = req.params.editId;
  let product = await ProductModel.findOne({ _id: editId });
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  if (product.status != 1) {
    return res.status(500).json({ msg: "there error try again later" });
  }
  try {
    let data = await ProductModel.updateOne({ _id: editId }, req.body)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

module.exports = router;