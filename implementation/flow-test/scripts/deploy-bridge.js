import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Hardcoded configuration for testnet
const FLOW_CONFIG = {
  contractAddress: "0xd0963316d56da678",
  network: "testnet",
  dependencies: {
    FungibleToken: "0x9a0766d93b6608b7",
    NonFungibleToken: "0x631e88ae7f1d7c20",
    IPRegistration: "0xd0963316d56da678"
  }
};

async function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
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
  console.log("Deploying Flow contracts...");

  try {
    // Create deployment transactions directory if it doesn't exist
    if (!fs.existsSync("./cadence/transactions")) {
      fs.mkdirSync("./cadence/transactions", { recursive: true });
    }

    // Deploy ProjectAuction first
    const projectAuctionCode = fs.readFileSync("./cadence/contracts/ProjectAuction.cdc", "utf8");
    const projectAuctionTx = `
      transaction {
        prepare(signer: AuthAccount) {
          signer.contracts.add(
            name: "ProjectAuction",
            code: "${projectAuctionCode.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
          )
        }
      }
    `;
    
    fs.writeFileSync(
      "./cadence/transactions/deploy_project_auction.cdc",
      projectAuctionTx
    );

    // Deploy NounsAuctionBridge
    const bridgeCode = fs.readFileSync("./cadence/contracts/NounsAuctionBridge.cdc", "utf8");
    const bridgeTx = `
      transaction {
        prepare(signer: AuthAccount) {
          signer.contracts.add(
            name: "NounsAuctionBridge",
            code: "${bridgeCode.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
          )
        }
      }
    `;
    
    fs.writeFileSync(
      "./cadence/transactions/deploy_bridge.cdc",
      bridgeTx
    );

    console.log("Created deployment transactions");

    // Deploy using flow CLI
    const deployCommand = `flow project deploy --network ${FLOW_CONFIG.network} --update`;
    
    console.log("Executing deployment command:", deployCommand);
    await execCommand(deployCommand);

    console.log("Contracts deployed successfully");

    // Save deployment information
    const deployments = {
      ProjectAuction: FLOW_CONFIG.contractAddress,
      NounsAuctionBridge: FLOW_CONFIG.contractAddress,
      network: FLOW_CONFIG.network,
      dependencies: FLOW_CONFIG.dependencies
    };

    const deploymentsDir = path.join(__dirname, "../../src/contracts");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(deploymentsDir, "deployments.json"),
      JSON.stringify(deployments, null, 2)
    );

    console.log("Deployment information saved");
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main(); 