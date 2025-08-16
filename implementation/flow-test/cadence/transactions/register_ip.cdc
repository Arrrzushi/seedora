import "IPRegistration"
import "MetadataViews"

transaction(
    ipHash: String,
    name: String,
    description: String,
    thumbnail: String
) {
    let minter: &IPRegistration.Minter
    let collection: &IPRegistration.Collection{NonFungibleToken.CollectionPublic}

    prepare(signer: AuthAccount) {
        // Get minter reference
        self.minter = signer.storage.borrow<&IPRegistration.Minter>(from: IPRegistration.MinterStoragePath)
            ?? panic("Could not borrow minter reference")

        // Get collection reference
        self.collection = signer.storage.borrow<&IPRegistration.Collection>(from: IPRegistration.CollectionStoragePath)
            ?? panic("Could not borrow collection reference")
    }

    execute {
        let metadata: {String: AnyStruct} = {
            "name": name,
            "description": description,
            "thumbnail": thumbnail
        }

        // Create the NFT
        let nft <- self.minter.createNFT(
            ipHash: ipHash,
            metadata: metadata
        )

        // Deposit it in the collection
        self.collection.deposit(token: <-nft)
    }
} 