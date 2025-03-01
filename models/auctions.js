const mongoose = require("mongoose");

// Auction Item Schema
const auctionItemSchema = new mongoose.Schema({
    itemName: String,
    description: String,
    currentBid: Number,
    highestBidder: String,
    closingTime: Date,
    isClosed: { type: Boolean, default: false },
  });
  
  const AuctionItem = mongoose.model('AuctionItem', auctionItemSchema);

  module.exports = AuctionItem;
