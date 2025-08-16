import "FungibleToken"

transaction {
    prepare(signer: &Account) {
        log("Test transaction with account: ".concat(signer.address.toString()))
    }
} 