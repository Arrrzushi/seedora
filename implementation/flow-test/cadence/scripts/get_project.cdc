import ProjectMining from "../contracts/ProjectMining.cdc"

access(all) fun main(projectId: UInt64): ProjectMining.Project? {
    return ProjectMining.getProject(projectId: projectId)
} 