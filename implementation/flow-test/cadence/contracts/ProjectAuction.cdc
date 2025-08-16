import FungibleToken from 0x9a0766d93b6608b7
import NonFungibleToken from 0x631e88ae7f1d7c20
import IPRegistration from 0xd0963316d56da678

access(all) contract ProjectAuction {
    // Events
    access(all) event AuctionCreated(projectId: UInt64, startPrice: UFix64, endTime: UFix64)
    access(all) event BidPlaced(projectId: UInt64, bidder: Address, amount: UFix64)
    access(all) event AuctionSettled(projectId: UInt64, winner: Address, amount: UFix64)

    // Contract fields
    access(contract) var auctions: {UInt64: Auction}

    // Storage paths
    access(all) let AuctionStoragePath: StoragePath
    access(all) let AuctionPublicPath: PublicPath

    // Auction struct to store auction details
    access(all) struct Auction {
        access(all) let projectId: UInt64
        access(all) let startPrice: UFix64
        access(all) let endTime: UFix64
        access(all) let highestBid: UFix64
        access(all) let highestBidder: Address?

        init(projectId: UInt64, startPrice: UFix64, endTime: UFix64, highestBid: UFix64, highestBidder: Address?) {
            self.projectId = projectId
            self.startPrice = startPrice
            self.endTime = endTime
            self.highestBid = highestBid
            self.highestBidder = highestBidder
        }
    }

    // Resource for managing auctions
    access(all) resource AuctionHouse {
        access(all) fun createAuction(projectId: UInt64, startPrice: UFix64, endTime: UFix64) {
            let auction = Auction(
                projectId: projectId,
                startPrice: startPrice,
                endTime: endTime,
                highestBid: startPrice,
                highestBidder: nil
            )
            ProjectAuction.auctions[projectId] = auction
            emit AuctionCreated(projectId: projectId, startPrice: startPrice, endTime: endTime)
        }

        access(all) fun placeBid(projectId: UInt64, amount: UFix64, bidder: Address) {
            pre {
                ProjectAuction.auctions[projectId] != nil: "Auction does not exist"
                getCurrentBlock().timestamp <= ProjectAuction.auctions[projectId]!.endTime: "Auction has ended"
                amount > ProjectAuction.auctions[projectId]!.highestBid: "Bid must be higher than current highest bid"
            }

            let currentAuction = ProjectAuction.auctions[projectId]!
            let newAuction = Auction(
                projectId: currentAuction.projectId,
                startPrice: currentAuction.startPrice,
                endTime: currentAuction.endTime,
                highestBid: amount,
                highestBidder: bidder
            )
            ProjectAuction.auctions[projectId] = newAuction

            emit BidPlaced(projectId: projectId, bidder: bidder, amount: amount)
        }

        access(all) fun getAuction(projectId: UInt64): Auction? {
            return ProjectAuction.auctions[projectId]
        }

        init() {}
    }

    init() {
        self.auctions = {}

        // Initialize storage paths
        self.AuctionStoragePath = /storage/ProjectAuctionHouse
        self.AuctionPublicPath = /public/ProjectAuctionHouse

        // Create the AuctionHouse resource
        let auctionHouse <- create AuctionHouse()
        
        // Save the AuctionHouse resource to storage
        self.account.storage.save(<-auctionHouse, to: self.AuctionStoragePath)

        // Create a public capability
        self.account.capabilities.publish(
            self.account.capabilities.storage.issue<&AuctionHouse>(self.AuctionStoragePath),
            at: self.AuctionPublicPath
        )
    }
} 