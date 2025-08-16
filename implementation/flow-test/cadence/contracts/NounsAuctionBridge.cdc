import FungibleToken from 0x9a0766d93b6608b7
import NonFungibleToken from 0x631e88ae7f1d7c20
import ProjectAuction from 0xd0963316d56da678

access(all) contract NounsAuctionBridge {
    // Events
    access(all) event BridgeBidPlaced(projectId: UInt64, bidder: Address, amount: UFix64)
    access(all) event BridgeAuctionSettled(projectId: UInt64, winner: Address, amount: UFix64)

    // Storage paths
    access(all) let BridgeStoragePath: StoragePath
    access(all) let BridgePublicPath: PublicPath

    // Bridge resource to handle cross-chain bids
    access(all) resource Bridge {
        access(all) fun placeBid(projectId: UInt64, amount: UFix64, bidder: Address) {
            // Get reference to ProjectAuction contract
            let auctionRef = getAccount(0xd0963316d56da678)
                .capabilities
                .borrow<&ProjectAuction.AuctionHouse>(ProjectAuction.AuctionPublicPath)
                ?? panic("Could not borrow reference to AuctionHouse")

            // Place bid through the auction contract
            auctionRef.placeBid(projectId: projectId, amount: amount, bidder: bidder)

            emit BridgeBidPlaced(projectId: projectId, bidder: bidder, amount: amount)
        }

        init() {}
    }

    init() {
        // Initialize storage paths
        self.BridgeStoragePath = /storage/NounsAuctionBridge
        self.BridgePublicPath = /public/NounsAuctionBridge

        // Create the Bridge resource
        let bridge <- create Bridge()
        
        // Save the Bridge resource to storage
        self.account.storage.save(<-bridge, to: self.BridgeStoragePath)

        // Create a public capability
        self.account.capabilities.publish(
            self.account.capabilities.storage.issue<&Bridge>(self.BridgeStoragePath),
            at: self.BridgePublicPath
        )
    }
}