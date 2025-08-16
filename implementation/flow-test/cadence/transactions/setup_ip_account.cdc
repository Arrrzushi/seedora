import NonFungibleToken from 0x631e88ae7f1d7c20
import IPRegistration from 0xd0963316d56da678

transaction {
    prepare(acct: AuthAccount) {
        // Check if the collection already exists
        if acct.borrow<&IPRegistration.Collection>(from: /storage/IPRegistrationCollection) == nil {
            // Create a new empty collection
            let collection <- IPRegistration.createEmptyCollection()
            
            // Save it to the account
            acct.save(<-collection, to: /storage/IPRegistrationCollection)

            // Create a public capability for the collection
            acct.link<&{NonFungibleToken.CollectionPublic}>(
                /public/IPRegistrationCollection,
                target: /storage/IPRegistrationCollection
            )
        }
    }
} 