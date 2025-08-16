import "Crypto"
import FungibleToken from 0x9a0766d93b6608b7
import ContributionToken from 0xd0963316d56da678

transaction(recipient: Address, amount: UFix64) {
    // The Minter reference stored in private storage
    let minterRef: &ContributionToken.Minter

    prepare(signer: AuthAccount) {
        // Get a reference to the minter resource
        self.minterRef = signer.borrow<&ContributionToken.Minter>(from: /storage/contributionTokenMinter)
            ?? panic("Could not borrow reference to minter")
    }

    execute {
        // Get the recipient's public account object
        let recipientAccount = getAccount(recipient)

        // Get a reference to the recipient's Receiver
        let receiverRef = recipientAccount.getCapability(/public/contributionTokenReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Could not borrow receiver reference")

        // Mint the tokens
        let mintedVault <- self.minterRef.mintTokens(amount: amount)

        // Deposit them to the recipient's account
        receiverRef.deposit(from: <-mintedVault)
    }
} 