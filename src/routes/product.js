const express = require("express");
const router = express.Router();
const product = require("../controllers/product");
const multer = require("multer");

// declare assets folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./assets/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// upload image to folder assets
const upload = multer({ storage: storage });

// routes
// upload product
router.post("/product", upload.single("sku_image"), product.AddProduct);

// get all product
router.get("/product", product.getAllProduct);

// get by sku_code
router.get("/product/:sku_code", product.getProductBySkuCode);

// add stock
router.post("/product/:sku_code/add-stock", product.addStock);

// deduct stock
router.post("/product/:sku_code/deduct-stock", product.deductStock);

module.exports = router;
