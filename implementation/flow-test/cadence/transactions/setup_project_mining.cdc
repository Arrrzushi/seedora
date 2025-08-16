import ContributionToken from 0xf8d6e0586b0a20c7
import ProjectMining from 0xf8d6e0586b0a20c7

transaction {
    prepare(signer: auth(Storage, BorrowValue) &Account) {
        // Create an empty vault
        let vault <- ContributionToken.createEmptyVault()

        // Create the admin resource with the vault
        let admin <- ProjectMining.createAdmin(vault: <-vault)

        // Save the admin resource
        signer.storage.save(<-admin, to: ProjectMining.AdminStoragePath)
    }
} 