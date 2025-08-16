const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy TestNFT first
  const TestNFT = await hre.ethers.getContractFactory("TestNFT");
  const testNFT = await TestNFT.deploy();
  await testNFT.deployed();
  console.log("TestNFT deployed to:", testNFT.address);

  // Deploy AuctionHouse
  const AuctionHouse = await hre.ethers.getContractFactory("AuctionHouse");
  const auctionHouse = await AuctionHouse.deploy(
    testNFT.address,        // NFT contract address
    300,                    // Time buffer (5 minutes)
    hre.ethers.utils.parseEther("0.1"),  // Reserve price (0.1 ETH)
    10,                     // Min bid increment percentage
    86400                   // Duration (24 hours)
  );
  await auctionHouse.deployed();
  console.log("AuctionHouse deployed to:", auctionHouse.address);

  // Save deployment addresses
  const deployments = {
    TestNFT: testNFT.address,
    AuctionHouse: auctionHouse.address,
    network: process.env.HARDHAT_NETWORK || 'localhost'
  };

  const deploymentsDir = path.join(__dirname, "../frontend/src/contracts");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, "deployments.json"),
    JSON.stringify(deployments, null, 2)
  );
  console.log("Deployment addresses saved to:", path.join(deploymentsDir, "deployments.json"));

  // Transfer ownership of TestNFT to AuctionHouse
  await testNFT.transferOwnership(auctionHouse.address);
  console.log("TestNFT ownership transferred to AuctionHouse");

  // Verify contracts on Etherscan if not on localhost
  if (process.env.HARDHAT_NETWORK !== 'localhost' && process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contracts on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: testNFT.address,
        contract: "contracts/TestNFT.sol:TestNFT",
      });

      await hre.run("verify:verify", {
        address: auctionHouse.address,
        contract: "contracts/AuctionHouse.sol:AuctionHouse",
        constructorArguments: [
          testNFT.address,
          300,
          hre.ethers.utils.parseEther("0.1"),
          10,
          86400
        ],
      });
    } catch (error) {
      console.error("Error verifying contracts:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 