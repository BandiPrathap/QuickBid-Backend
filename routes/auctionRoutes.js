const express = require("express");
const router = express.Router();
const {createAuctionItem, getAuctions, getAuctionById, bidItem} = require("../controllers/auctionController");
const authenticate = require("../middleware/authenticate");

router.post("/auction", authenticate, createAuctionItem);
router.get("/auctions",getAuctions);
router.get("/auctions/:id",getAuctionById);
router.post("/bid/:id", authenticate, bidItem);
router.get("/hello",(req,res)=>res.send("Hello Bandi"));

module.exports = router;