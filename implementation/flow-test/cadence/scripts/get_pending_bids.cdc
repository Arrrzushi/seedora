import NounsAuctionBridge from 0xd0963316d56da678

access(all) fun main(projectId: UInt64): [NounsAuctionBridge.PendingBid] {
    let bridge = getAccount(0xd0963316d56da678)
        .capabilities
        .borrow<&NounsAuctionBridge.Bridge>(NounsAuctionBridge.BridgePublicPath)
        ?? panic("Could not borrow bridge reference")

    return bridge.getPendingBids(projectId: projectId)
} 