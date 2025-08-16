import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20

access(all) contract IPRegistration: NonFungibleToken {
    // Events
    access(all) event ContractInitialized()
    access(all) event Withdraw(id: UInt64, from: Address?)
    access(all) event Deposit(id: UInt64, to: Address?)
    access(all) event IPRegistered(id: UInt64, owner: Address, ipHash: String)

    // Paths
    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath
    access(all) let MinterStoragePath: StoragePath

    // Contract Fields
    access(all) var totalSupply: UInt64

    // IP NFT Resource
    access(all) resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        access(all) let id: UInt64
        access(all) let ipHash: String
        access(all) let metadata: {String: AnyStruct}

        init(id: UInt64, ipHash: String, metadata: {String: AnyStruct}) {
            self.id = id
            self.ipHash = ipHash
            self.metadata = metadata
        }

        access(all) fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Royalties>(),
                Type<MetadataViews.Editions>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Serial>(),
                Type<MetadataViews.Traits>()
            ]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.metadata["name"] as! String,
                        description: self.metadata["description"] as! String,
                        thumbnail: MetadataViews.HTTPFile(
                            url: self.metadata["thumbnail"] as! String
                        )
                    )
                case Type<MetadataViews.Serial>():
                    return MetadataViews.Serial(
                        self.id
                    )
            }
            return nil
        }
    }

    // Collection Resource
    access(all) resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        access(all) var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        // Provider
        access(all) fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("NFT not found")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <-token
        }

        // Receiver
        access(all) fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @IPRegistration.NFT
            let id: UInt64 = token.id
            let oldToken <- self.ownedNFTs[id] <- token
            emit Deposit(id: id, to: self.owner?.address)
            destroy oldToken
        }

        // CollectionPublic
        access(all) fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        access(all) fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        access(all) fun borrowViewResolver(id: UInt64): &{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
            let ipNFT = nft as! &IPRegistration.NFT
            return ipNFT
        }
    }

    // Minter Resource
    access(all) resource Minter {
        access(all) fun createNFT(ipHash: String, metadata: {String: AnyStruct}): @NFT {
            let currentID = IPRegistration.totalSupply
            IPRegistration.totalSupply = currentID + 1
            let nft <- create NFT(
                id: currentID,
                ipHash: ipHash,
                metadata: metadata
            )
            emit IPRegistered(id: currentID, owner: self.owner?.address!, ipHash: ipHash)
            return <-nft
        }
    }

    access(all) fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <-create Collection()
    }

    init() {
        self.totalSupply = 0
        self.CollectionStoragePath = /storage/IPRegistrationCollection
        self.CollectionPublicPath = /public/IPRegistrationCollection
        self.MinterStoragePath = /storage/IPRegistrationMinter

        // Create a Minter resource and save it to storage
        let minter <- create Minter()
        self.account.storage.save(<-minter, to: self.MinterStoragePath)

        // Create and setup the collection
        let collection <- create Collection()
        self.account.storage.save(<-collection, to: self.CollectionStoragePath)
        
        // Use intersection type instead of restricted type
        self.account.link<&{NonFungibleToken.CollectionPublic}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        emit ContractInitialized()
    }
} 