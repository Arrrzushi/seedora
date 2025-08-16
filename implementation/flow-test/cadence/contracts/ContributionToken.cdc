import FungibleToken from 0x9a0766d93b6608b7
import FungibleTokenMetadataViews from 0x9a0766d93b6608b7
import MetadataViews from 0x631e88ae7f1d7c20

access(all) contract ContributionToken: FungibleToken {
    // Token configuration
    access(all) let VaultStoragePath: StoragePath
    access(all) let VaultPublicPath: PublicPath
    access(all) let MinterStoragePath: StoragePath
    access(all) var totalSupply: UFix64

    // Events
    access(all) event TokensInitialized(initialSupply: UFix64)
    access(all) event TokensWithdrawn(amount: UFix64, from: Address?)
    access(all) event TokensDeposited(amount: UFix64, to: Address?)
    access(all) event TokensMinted(amount: UFix64)
    access(all) event TokensBurned(amount: UFix64)

    // The Vault resource that holds the tokens
    access(all) resource Vault: FungibleToken.Vault {
        access(all) var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }

        access(all) fun withdraw(amount: UFix64): @FungibleToken.Vault {
            pre {
                self.balance >= amount: "Insufficient funds"
            }
            post {
                self.balance == self.balance - amount: "Withdrawn amount must equal requested amount"
            }
            self.balance = self.balance - amount
            ContributionToken.totalSupply = ContributionToken.totalSupply - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            let vault <- create Vault(balance: amount)
            return <-vault
        }

        access(all) fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @ContributionToken.Vault
            let amount = vault.balance
            self.balance = self.balance + amount
            ContributionToken.totalSupply = ContributionToken.totalSupply + amount
            emit TokensDeposited(amount: amount, to: self.owner?.address)
            destroy vault
        }

        access(all) view fun getViews(): [Type] {
            return [
                Type<FungibleTokenMetadataViews.FTView>(),
                Type<FungibleTokenMetadataViews.FTDisplay>(),
                Type<FungibleTokenMetadataViews.FTVaultData>()
            ]
        }

        access(all) view fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<FungibleTokenMetadataViews.FTView>():
                    return FungibleTokenMetadataViews.FTView(
                        ftDisplay: self.resolveView(Type<FungibleTokenMetadataViews.FTDisplay>()) as! FungibleTokenMetadataViews.FTDisplay?,
                        ftVaultData: self.resolveView(Type<FungibleTokenMetadataViews.FTVaultData>()) as! FungibleTokenMetadataViews.FTVaultData?
                    )
                case Type<FungibleTokenMetadataViews.FTDisplay>():
                    let media = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: "https://contribution.token/icon.png"
                        ),
                        mediaType: "image/png"
                    )
                    let medias = MetadataViews.Medias([media])
                    return FungibleTokenMetadataViews.FTDisplay(
                        name: "Contribution Token",
                        symbol: "CONT",
                        description: "A token for tracking contributions",
                        externalURL: MetadataViews.ExternalURL("https://contribution.token"),
                        logos: medias,
                        socials: {
                            "twitter": MetadataViews.ExternalURL("https://twitter.com/contribution_token")
                        }
                    )
                case Type<FungibleTokenMetadataViews.FTVaultData>():
                    return FungibleTokenMetadataViews.FTVaultData(
                        storagePath: ContributionToken.VaultStoragePath,
                        receiverPath: ContributionToken.VaultPublicPath,
                        metadataPath: /public/contributionTokenMetadata,
                        receiverLinkedType: Type<&ContributionToken.Vault>(),
                        metadataLinkedType: Type<&ContributionToken.Vault>(),
                        createEmptyVaultFunction: (fun (): @FungibleToken.Vault {
                            return <-ContributionToken.createEmptyVault()
                        })
                    )
            }
            return nil
        }
    }

    // Resource that allows minting new tokens
    access(all) resource Minter {
        access(all) fun mintTokens(amount: UFix64): @ContributionToken.Vault {
            ContributionToken.totalSupply = ContributionToken.totalSupply + amount
            emit TokensMinted(amount: amount)
            return <-create Vault(balance: amount)
        }
    }

    access(all) fun createEmptyVault(): @FungibleToken.Vault {
        let vault <- create Vault(balance: 0.0)
        return <-vault
    }

    init() {
        self.VaultStoragePath = /storage/contributionTokenVault
        self.VaultPublicPath = /public/contributionTokenReceiver
        self.MinterStoragePath = /storage/contributionTokenMinter
        self.totalSupply = 0.0

        // Create the Minter resource and save it in storage
        let minter <- create Minter()
        self.account.storage.save(<-minter, to: self.MinterStoragePath)

        emit TokensInitialized(initialSupply: self.totalSupply)
    }
} 