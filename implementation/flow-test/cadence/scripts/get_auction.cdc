import ProjectAuction from 0xd0963316d56da678

fun main(projectId: UInt64): {String: AnyStruct}? {
    let auctionRef = getAccount(0xd0963316d56da678)
        .getCapability(/public/ProjectAuctionHouse)
        .borrow<&ProjectAuction.AuctionHouse>()
        ?? panic("Could not borrow AuctionHouse reference")

    return auctionRef.getAuction(projectId: projectId)
} 