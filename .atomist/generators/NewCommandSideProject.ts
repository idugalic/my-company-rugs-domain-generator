import { Project } from "@atomist/rug/model/Project";
import { Generator, Parameter, Tags } from "@atomist/rug/operations/Decorators";
import { PopulateProject } from "@atomist/rug/operations/ProjectGenerator";
import { Pattern } from "@atomist/rug/operations/RugOperation";
import {
    cleanChangeLog, cleanReadMe, movePackage, removeUnnecessaryFiles,
    renameClass, updateCircleCI, updatePom,
} from "./RugGeneratorFunctions";

/**
 * Sample TypeScript generator used by AddNewCommandSideProject.
 */
@Generator("NewCommandSideProject", "Rug generator for a Spring Boot - Command Side project")
@Tags("spring", "command", "idugalic")
export class NewCommandSideProject implements PopulateProject {

    @Parameter({
        displayName: "Aggregate name",
        // tslint:disable-next-line:max-line-length
        description: "Aggragate name will be used to construct maven artifact identifier: my-company-[aggragateName]-domain",
        pattern: "^[a-z][-a-z0-9_]*$", // Ideally this should be looking up artifactId as a common pattern
        // tslint:disable-next-line:max-line-length
        validInput: "a valid aggragate name, which starts with a lower-case letter and contains only alphanumeric, -, and _ characters",
        minLength: 1,
        maxLength: 50,
        required: true,
    })
    public aggragateName: string = "aggregate";

    @Parameter({
        displayName: "Version",
        description: "initial version of the project, e.g., 1.2.3-SNAPSHOT",
        pattern: Pattern.semantic_version,
        validInput: "a valid semantic version, http://semver.org",
        minLength: 1,
        maxLength: 50,
        required: false,
    })
    public version: string = "0.1.0-SNAPSHOT";

    @Parameter({
        displayName: "Project Description",
        description: "short descriptive text describing the new project",
        pattern: Pattern.any,
        validInput: "free text sentence fragment",
        minLength: 1,
        maxLength: 100,
        required: false,
    })
    public description: string = "Command Side - Aggregate";


    public populate(project: Project) {
        const artifactId: string = "my-company-" + this.aggragateName + "-domain";
        const  groupId: string = "com.idugalic";

        cleanReadMe(project, this.description, groupId);
        removeUnnecessaryFiles(project);
        // tslint:disable-next-line:max-line-length
        updatePom(project, artifactId, groupId, this.version, this.description);
        updateCircleCI(project, artifactId);
        movePackage(project, "com.idugalic.commandside.myaggregate", groupId + ".commandside." + project.name);
    }
}

export const newCommandSideProject = new NewCommandSideProject();
