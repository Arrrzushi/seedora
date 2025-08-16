import NounsAuctionBridge from 0xd0963316d56da678

transaction(projectId: UInt64, amount: UFix64) {
    prepare(signer: AuthAccount) {
        let bridgeRef = getAccount(0xd0963316d56da678)
            .capabilities
            .borrow<&NounsAuctionBridge.Bridge>(NounsAuctionBridge.BridgePublicPath)
            ?? panic("Could not borrow reference to Bridge")

        bridgeRef.placeBid(
            projectId: projectId,
            amount: amount,
            bidder: signer.address
        )
    }

    execute {
        log("Placed bid through bridge for project ID: ".concat(projectId.toString()))
        log("Bid amount: ".concat(amount.toString()))
    }
} 