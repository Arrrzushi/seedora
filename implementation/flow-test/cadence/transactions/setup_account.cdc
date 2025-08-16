import FungibleToken from 0x9a0766d93b6608b7  // Required for AuthAccount
import NonFungibleToken from 0x631e88ae7f1d7c20
import IPRegistration from 0xd0963316d56da678

transaction {
    prepare(signer: AuthAccount) {
        // Use EXACT paths from contract
        let storagePath = /storage/IPRegistrationCollection
        let publicPath = /public/IPRegistrationCollection

        if signer.borrow<&IPRegistration.Collection>(from: storagePath) == nil {
            // Create a new empty collection
            let collection <- IPRegistration.createEmptyCollection()
            
            // Save it to storage
            signer.save(<-collection, to: storagePath)
            
            // Create public capability using intersection type
            signer.link<&{NonFungibleToken.CollectionPublic}>(
                publicPath,
                target: storagePath
            )
        }
    }
}