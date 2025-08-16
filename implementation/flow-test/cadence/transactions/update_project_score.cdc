import ProjectMining from 0xf8d6e0586b0a20c7

transaction(projectId: UInt64, newScore: UFix64) {
    let adminRef: &ProjectMining.Admin

    prepare(signer: AuthAccount) {
        // Get admin reference
        self.adminRef = signer.storage.borrow<&ProjectMining.Admin>(
            from: ProjectMining.AdminStoragePath
        ) ?? panic("Could not borrow admin reference")
    }

    execute {
        // Update the project score
        self.adminRef.updateScore(projectId: projectId, newScore: newScore)
    }
} 