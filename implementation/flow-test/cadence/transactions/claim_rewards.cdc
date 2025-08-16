import ContributionToken from 0xf8d6e0586b0a20c7
import ProjectMining from 0xf8d6e0586b0a20c7
import FungibleToken from 0xee82856bf20e2aa6

transaction(projectId: UInt64) {
    let adminRef: &ProjectMining.Admin
    let receiverRef: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        // Get admin reference
        self.adminRef = signer.storage.borrow<&ProjectMining.Admin>(
            from: ProjectMining.AdminStoragePath
        ) ?? panic("Could not borrow admin reference")

        // Get receiver reference
        self.receiverRef = signer.capabilities.borrow<&{FungibleToken.Receiver}>(
            /public/contributionTokenReceiver
        ) ?? panic("Could not borrow receiver reference")
    }

    execute {
        // Calculate and distribute rewards
        // Using a fixed amount for now - this would typically be calculated based on time and score
        let rewardAmount: UFix64 = 10.0
        self.adminRef.distributeRewards(projectId: projectId, amount: rewardAmount)
    }
} 