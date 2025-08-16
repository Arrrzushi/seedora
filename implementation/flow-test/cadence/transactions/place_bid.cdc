import ProjectAuction from 0xd0963316d56da678
import FungibleToken from 0x9a0766d93b6608b7

transaction(projectId: UInt64, amount: UFix64) {
    prepare(acct: AuthAccount) {
        let auctionHouse = acct.borrow<&ProjectAuction.AuctionHouse>(from: ProjectAuction.StoragePath)
            ?? panic("Could not borrow AuctionHouse")

        auctionHouse.placeBid(projectId: projectId, amount: amount)
    }
} 