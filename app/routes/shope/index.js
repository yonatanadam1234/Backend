const express = require("express");
const router = express.Router();
const verifyToken = require("../../../middleware/auth");
const {  create, findeShop } = require("../../controllers/userShope");


router.post("/create", verifyToken, create);
router.get("/findeshop", verifyToken, findeShop);

module.exports = router;
