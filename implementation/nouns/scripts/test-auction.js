const { ethers } = require("hardhat");

async function main() {
  // Get the AuctionHouse contract
  const auctionHouse = await ethers.getContractAt("AuctionHouse", "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6");
  
  // Get signers (accounts)
  const [owner, bidder1, bidder2] = await ethers.getSigners();
  
  console.log("Testing auction with accounts:");
  console.log("Owner:", owner.address);
  console.log("Bidder1:", bidder1.address);
  console.log("Bidder2:", bidder2.address);

  // Get current auction info for token ID 0 (the first NFT we minted)
  const tokenId = 0;
  
  try {
    // Get auction details
    const auction = await auctionHouse.auctions(tokenId);
    console.log("\nCurrent Auction Status for Token ID:", tokenId);
    console.log("Current Highest Bid:", ethers.utils.formatEther(auction.amount), "ETH");
    console.log("Highest Bidder:", auction.bidder);
    console.log("Start Time:", new Date(auction.startTime.toNumber() * 1000).toLocaleString());
    console.log("End Time:", new Date(auction.endTime.toNumber() * 1000).toLocaleString());
    console.log("Reserve Price:", ethers.utils.formatEther(auction.reservePrice), "ETH");
    console.log("Settled:", auction.settled);

    // Place a bid from bidder1
    const bidAmount = ethers.utils.parseEther("1.0"); // 1 ETH
    console.log("\nPlacing bid of 1 ETH from bidder1...");
    
    const bidTx = await auctionHouse.connect(bidder1).createBid(tokenId, {
      value: bidAmount
    });
    await bidTx.wait();
    console.log("Bid placed successfully!");

    // Get updated auction info
    const updatedAuction = await auctionHouse.auctions(tokenId);
    console.log("\nUpdated Auction Status:");
    console.log("Current Highest Bid:", ethers.utils.formatEther(updatedAuction.amount), "ETH");
    console.log("Highest Bidder:", updatedAuction.bidder);

    // Place a higher bid from bidder2
    const higherBidAmount = ethers.utils.parseEther("1.5"); // 1.5 ETH
    console.log("\nPlacing bid of 1.5 ETH from bidder2...");
    
    const higherBidTx = await auctionHouse.connect(bidder2).createBid(tokenId, {
      value: higherBidAmount
    });
    await higherBidTx.wait();
    console.log("Higher bid placed successfully!");

    // Get final auction status
    const finalAuction = await auctionHouse.auctions(tokenId);
    console.log("\nFinal Auction Status:");
    console.log("Current Highest Bid:", ethers.utils.formatEther(finalAuction.amount), "ETH");
    console.log("Highest Bidder:", finalAuction.bidder);

  } catch (error) {
    console.error("Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 