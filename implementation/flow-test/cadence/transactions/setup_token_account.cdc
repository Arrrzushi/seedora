import FungibleToken from 0x9a0766d93b6608b7
import ContributionToken from 0xd0963316d56da678

transaction {
    prepare(signer: auth(Storage, BorrowValue, Capabilities, PublishCapability, StorageCapabilities, IssueStorageCapabilityController) &Account) {
        // Return early if the account already has a vault
        if signer.storage.borrow<&ContributionToken.Vault>(from: /storage/contributionTokenVault) != nil {
            return
        }

        // Create a new empty vault
        let vault <- ContributionToken.createEmptyVault()
        
        // Save it to the account
        signer.storage.save(<-vault, to: /storage/contributionTokenVault)

        // Create a public capability to the vault that only exposes the deposit function
        signer.capabilities.publish(
            signer.capabilities.storage.issue<&{FungibleToken.Receiver}>(
                /storage/contributionTokenVault
            ),
            at: /public/contributionTokenReceiver
        )

        // Create a public capability to the vault that only exposes the balance
        signer.capabilities.publish(
            signer.capabilities.storage.issue<&{FungibleToken.Balance}>(
                /storage/contributionTokenVault
            ),
            at: /public/contributionTokenBalance
        )
    }
} 