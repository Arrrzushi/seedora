import ProjectMining from 0xf8d6e0586b0a20c7

pub fun main(projectId: UInt64): {String: AnyStruct} {
    let project = ProjectMining.getProject(projectId: projectId)
        ?? panic("Project not found")

    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "owner": project.owner,
        "score": project.getScore(),
        "registrationDate": project.registrationDate,
        "lastRewardTime": project.getLastRewardTime()
    }
} 