import ProjectAuction from 0xd0963316d56da678

transaction(projectId: UInt64, startPrice: UFix64, endTime: UFix64) {
    prepare(signer: AuthAccount) {
        let auctionRef = signer.capabilities
            .borrow<&ProjectAuction.AuctionHouse>(ProjectAuction.AuctionStoragePath)
            ?? panic("Could not borrow reference to AuctionHouse")

        auctionRef.createAuction(
            projectId: projectId,
            startPrice: startPrice,
            endTime: endTime
        )
    }

    execute {
        log("Created auction for project ID: ".concat(projectId.toString()))
    }
} 