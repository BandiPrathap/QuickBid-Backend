const AuctionItem = require("../models/auctions")

// Create Auction Item (Protected)
const createAuctionItem = async (req, res) => {
    try {
      const { itemName, description, startingBid, closingTime } = req.body;
  
      if (!itemName || !description || !startingBid || !closingTime) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const newItem = new AuctionItem({
        itemName,
        description,
        currentBid: startingBid,
        highestBidder: '',
        closingTime,
      });
  
      await newItem.save();
      res.status(201).json({ message: 'Auction item created', item: newItem });
    } catch (error) {
      console.error('Auction Post Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  // Get all auction items
const getAuctions = async (req, res) => {
    try {
      const auctions = await AuctionItem.find();//get all
      //select * from actionitem
      res.json(auctions);
    } catch (error) {
      console.error('Fetching Auctions Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  // Get a single auction item by ID
const getAuctionById =  async (req, res) => {
    try {
      const auctionItem = await AuctionItem.findById(req.params.id);
      if (!auctionItem) 
        return res.status(404).json({ message: 'Auction not found' });
  
      res.json(auctionItem);
    } catch (error) {
      console.error('Fetching Auction Item Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
// Bidding on an item (Protected)
const bidItem = async (req, res) => {
  try {
      const { id } = req.params;
      const { bid } = req.body;

      // Ensure user is authenticated
      if (!req.user || !req.user.email) {
          return res.status(401).json({ message: "Unauthorized" });
      }

      // Fetch the auction item
      const item = await AuctionItem.findById(id);
      if (!item) return res.status(404).json({ message: "Auction item not found" });

      // Check if the auction is closed
      if (item.isClosed || new Date() > new Date(item.closingTime)) {
          item.isClosed = true;
          await item.save();
          return res.json({ message: "Auction closed", winner: item.highestBidder || "No winner" });
      }

      // Prevent the highest bidder from bidding again
      if (req.user.email === item.highestBidder) {
          return res.status(400).json({ message: "You are already the highest bidder" });
      }

      // Ensure bid is higher than the current bid
      if (bid <= item.currentBid) {
          return res.status(400).json({ message: "Bid too low" });
      }

      // Update highest bid and bidder
      item.currentBid = bid;
      item.highestBidder = req.user.email;
      await item.save();

      res.json({ message: "Bid successful", item });
  } catch (error) {
      console.error("Bidding Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {createAuctionItem, getAuctions, getAuctionById, bidItem};