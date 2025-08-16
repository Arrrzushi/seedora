import FungibleToken from 0x9a0766d93b6608b7
import ContributionToken from 0xd0963316d56da678

fun main(address: Address): UFix64 {
    let account = getAccount(address)
    
    let vaultRef = account
        .getCapability(/public/contributionTokenReceiver)
        .borrow<&{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference")
    
    return vaultRef.balance
} 