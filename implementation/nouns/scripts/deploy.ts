const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy TestNFT
  const TestNFT = await ethers.getContractFactory("TestNFT");
  const testNFT = await TestNFT.deploy();
  await testNFT.deployed();
  console.log("TestNFT deployed to:", testNFT.address);

  // Deploy AuctionHouse
  const TIME_BUFFER = 900; // 15 minutes
  const RESERVE_PRICE = ethers.utils.parseEther("0.1"); // 0.1 ETH
  const MIN_BID_INCREMENT = 5; // 5%
  const DURATION = 86400; // 24 hours

  const AuctionHouse = await ethers.getContractFactory("AuctionHouse");
  const auctionHouse = await AuctionHouse.deploy(
    testNFT.address,
    TIME_BUFFER,
    RESERVE_PRICE,
    MIN_BID_INCREMENT,
    DURATION
  );
  await auctionHouse.deployed();
  console.log("AuctionHouse deployed to:", auctionHouse.address);

  // Mint a test NFT and approve AuctionHouse
  await testNFT.mint(auctionHouse.address);
  await testNFT.setApprovalForAll(auctionHouse.address, true);
  console.log("Minted test NFT and approved AuctionHouse");

  // Create first auction
  await auctionHouse.createAuction(0, 0);
  console.log("Created first auction for token ID 0");

  // Write deployment addresses to a file
  const fs = require("fs");
  const deployments = {
    TestNFT: testNFT.address,
    AuctionHouse: auctionHouse.address,
  };
  
  fs.writeFileSync(
    "frontend/src/contracts/deployments.json",
    JSON.stringify(deployments, null, 2)
  );
  console.log("Deployment addresses written to frontend/src/contracts/deployments.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 