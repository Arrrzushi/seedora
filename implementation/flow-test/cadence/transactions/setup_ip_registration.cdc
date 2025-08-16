import NonFungibleToken from 0x631e88ae7f1d7c20
import IPRegistration from 0xd0963316d56da678

transaction {
    prepare(signer: AuthAccount) {
        // Check if the collection already exists
        if signer.borrow<&IPRegistration.Collection>(from: IPRegistration.CollectionStoragePath) == nil {
            // Create a new empty collection
            let collection <- IPRegistration.createEmptyCollection()
            
            // Save it to the account
            signer.save(<-collection, to: IPRegistration.CollectionStoragePath)

            // Create a public capability for the collection
            signer.link<&{NonFungibleToken.CollectionPublic}>(
                IPRegistration.CollectionPublicPath,
                target: IPRegistration.CollectionStoragePath
            )
        }
    }
} 