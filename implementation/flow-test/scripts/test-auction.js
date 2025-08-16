import { exec } from "child_process";
import fs from "fs";
import path from "path";

// Test configuration
const TEST_CONFIG = {
  network: "testnet",
  projectId: "1",
  bidAmount: "10.0",
  accountAddress: "0xd0963316d56da678"
};

async function execFlowCommand(command) {
  return new Promise((resolve, reject) => {
    exec(`flow ${command} --network ${TEST_CONFIG.network}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`);
        reject(error);
        return;
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
}

async function main() {
  try {
    console.log("Testing auction system...");

    // 1. Check account setup
    console.log("\nChecking account setup...");
    await execFlowCommand(`account contracts list ${TEST_CONFIG.accountAddress}`);

    // 2. Create a test auction
    console.log("\nCreating test auction...");
    const createAuctionTx = `
      transaction(projectId: UInt64, startPrice: UFix64, duration: UFix64) {
        prepare(signer: AuthAccount) {
          let auction = signer
            .borrow<&ProjectAuction.AuctionHouse>(from: ProjectAuction.StoragePath)
            ?? panic("Could not borrow auction reference")

          auction.createAuction(
            projectId: projectId,
            startPrice: startPrice,
            duration: duration,
            minBidIncrement: 0.1
          )
        }
      }
    `;

    fs.writeFileSync(
      "./cadence/transactions/create_test_auction.cdc",
      createAuctionTx
    );

    await execFlowCommand(
      `transaction send ./cadence/transactions/create_test_auction.cdc ${TEST_CONFIG.projectId} 5.0 3600.0`
    );

    // 3. Place a test bid
    console.log("\nPlacing test bid...");
    await execFlowCommand(
      `transaction send ./cadence/transactions/place_bridge_bid.cdc ${TEST_CONFIG.projectId} ${TEST_CONFIG.bidAmount}`
    );

    // 4. Check pending bids
    console.log("\nChecking pending bids...");
    const script = `
      import NounsAuctionBridge from ${TEST_CONFIG.accountAddress}

      pub fun main(projectId: UInt64): [NounsAuctionBridge.PendingBid] {
        let bridge = getAccount(${TEST_CONFIG.accountAddress})
          .getCapability<&{NounsAuctionBridge.BridgePublic}>(NounsAuctionBridge.PublicPath)
          .borrow()
          ?? panic("Could not borrow bridge reference")

        return bridge.getPendingBids(projectId: projectId)
      }
    `;

    fs.writeFileSync(
      "./cadence/scripts/get_test_bids.cdc",
      script
    );

    await execFlowCommand(
      `script execute ./cadence/scripts/get_test_bids.cdc ${TEST_CONFIG.projectId}`
    );

    console.log("\nTest completed successfully!");
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

main(); 