import ContributionToken from 0xd0963316d56da678
import FungibleToken from 0x9a0766d93b6608b7

access(all) contract ProjectMining {
    // Events
    access(all) event ProjectRegistered(id: UInt64, name: String, owner: Address)
    access(all) event ScoreUpdated(projectId: UInt64, newScore: UFix64)
    access(all) event RewardsDistributed(projectId: UInt64, amount: UFix64)

    // Project struct to store project information
    access(all) struct Project {
        access(all) let id: UInt64
        access(all) let name: String
        access(all) let description: String
        access(all) let owner: Address
        access(self) var score: UFix64
        access(all) let registrationDate: UFix64
        access(self) var lastRewardTime: UFix64

        init(
            id: UInt64,
            name: String,
            description: String,
            owner: Address
        ) {
            self.id = id
            self.name = name
            self.description = description
            self.owner = owner
            self.score = 0.0
            self.registrationDate = getCurrentBlock().timestamp
            self.lastRewardTime = getCurrentBlock().timestamp
        }

        access(all) fun getScore(): UFix64 {
            return self.score
        }

        access(all) fun getLastRewardTime(): UFix64 {
            return self.lastRewardTime
        }

        access(contract) fun setScore(_ newScore: UFix64) {
            self.score = newScore
        }

        access(contract) fun setLastRewardTime(_ time: UFix64) {
            self.lastRewardTime = time
        }
    }

    // Storage paths
    access(all) let RewardsVaultPath: StoragePath
    access(all) let AdminStoragePath: StoragePath

    // Storage
    access(self) var projects: {UInt64: Project}
    access(self) var nextProjectId: UInt64

    // Admin resource for managing projects and rewards
    access(all) resource Admin {
        access(self) let rewardsVault: @ContributionToken.Vault

        init(vault: @ContributionToken.Vault) {
            self.rewardsVault <- vault
        }

        // Register new project
        access(all) fun registerProject(
            name: String,
            description: String
        ): UInt64 {
            pre {
                name.length > 0: "Name cannot be empty"
                description.length > 0: "Description cannot be empty"
            }

            let projectId = ProjectMining.nextProjectId
            let project = Project(
                id: projectId,
                name: name,
                description: description,
                owner: self.owner?.address ?? panic("No owner address")
            )

            ProjectMining.projects[projectId] = project
            ProjectMining.nextProjectId = projectId + 1

            emit ProjectRegistered(id: projectId, name: name, owner: self.owner?.address ?? panic("No owner address"))
            return projectId
        }

        // Update project score
        access(all) fun updateScore(projectId: UInt64, newScore: UFix64) {
            pre {
                ProjectMining.projects[projectId] != nil: "Project does not exist"
                newScore >= 0.0: "Score must be non-negative"
            }

            if let project = &ProjectMining.projects[projectId] as &Project? {
                project.setScore(newScore)
                emit ScoreUpdated(projectId: projectId, newScore: newScore)
            }
        }

        // Distribute rewards
        access(all) fun distributeRewards(projectId: UInt64, amount: UFix64) {
            pre {
                ProjectMining.projects[projectId] != nil: "Project does not exist"
                amount > 0.0: "Amount must be positive"
                self.rewardsVault.balance >= amount: "Insufficient rewards balance"
            }

            let project = ProjectMining.projects[projectId]!
            let currentTime = getCurrentBlock().timestamp
            let timeElapsed = currentTime - project.getLastRewardTime()

            // Calculate rewards based on time and score
            let rewardAmount = amount * (1.0 + (project.getScore() / 100.0))

            // Get project owner's token receiver
            let receiverRef = getAccount(project.owner)
                .capabilities
                .borrow<&{FungibleToken.Receiver}>(/public/contributionTokenReceiver)
                ?? panic("Could not borrow receiver reference")

            // Withdraw rewards and deposit to project owner
            let rewardTokens <- self.rewardsVault.withdraw(amount: rewardAmount)
            receiverRef.deposit(from: <-rewardTokens)

            // Update last reward time
            if let projectRef = &ProjectMining.projects[projectId] as &Project? {
                projectRef.setLastRewardTime(currentTime)
            }

            emit RewardsDistributed(projectId: projectId, amount: rewardAmount)
        }

        // Add rewards to the vault
        access(all) fun addRewards(tokens: @{FungibleToken.Vault}) {
            self.rewardsVault.deposit(from: <-tokens)
        }
    }

    // Public functions
    access(all) fun getProject(projectId: UInt64): Project? {
        return self.projects[projectId]
    }

    access(all) fun getProjectScore(projectId: UInt64): UFix64? {
        return self.projects[projectId]?.getScore()
    }

    access(all) fun getNextProjectId(): UInt64 {
        return self.nextProjectId
    }

    // Create a new Admin resource with a vault
    access(all) fun createAdmin(vault: @ContributionToken.Vault): @Admin {
        return <-create Admin(vault: <-vault)
    }

    init() {
        self.projects = {}
        self.nextProjectId = 1
        self.RewardsVaultPath = /storage/projectMiningRewardsVault
        self.AdminStoragePath = /storage/projectMiningAdmin
    }
} 