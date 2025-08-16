import ProjectMining from "../contracts/ProjectMining.cdc"

transaction(name: String, description: String) {
    prepare(signer: AuthAccount) {
        // Get the admin reference
        let adminRef = signer.storage
            .borrow<&ProjectMining.Admin>(from: ProjectMining.AdminStoragePath)
            ?? panic("Could not borrow admin reference")

        // Register the project
        let projectId = adminRef.registerProject(
            name: name,
            description: description
        )

        log("Project registered with ID: ".concat(projectId.toString()))
    }
} 