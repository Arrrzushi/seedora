import FungibleToken from 0x9a0766d93b6608b7
import ContributionToken from 0xd0963316d56da678

transaction {
    prepare(signer: auth(Storage, BorrowValue) &Account) {
        let vaultRef = signer.storage.borrow<&ContributionToken.Vault>(from: /storage/contributionTokenVault)
        if vaultRef != nil {
            log("Vault exists")
        } else {
            log("Vault does not exist")
        }
    }
} 