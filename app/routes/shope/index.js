const express = require("express");
const router = express.Router();
const verifyToken = require("../../../middleware/auth");
const {  create, findeShop, deleteShop } = require("../../controllers/userShope");


router.post("/create", verifyToken, create);
router.get("/findeshop", verifyToken, findeShop);
router.get("/delete", verifyToken, deleteShop);

module.exports = router;
