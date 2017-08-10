/*
 * Copyright © 2017 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { File } from "@atomist/rug/model/File";
import { JavaSource } from "@atomist/rug/model/JavaSource";
import { JavaType } from "@atomist/rug/model/JavaType";
import { Pom } from "@atomist/rug/model/Pom";
import { Project } from "@atomist/rug/model/Project";

import { PathExpressionEngine } from "@atomist/rug/tree/PathExpression";

/**
 * Remove content from README specific to this project.
 *
 * @param project      Project whose README should be cleaned.
 * @param description  Brief description of newly created project.
 * @param owner        GitHub owner of newly created project.
 */
export function cleanReadMe(project: Project, description: string, owner: string): void {
    const readMe: File = project.findFile("README.md");
    readMe.setContent('# ReadMe \r\n\r\nThis component processes commands. Commands are actions which change state in some way. The execution of these commands results in Events being generated which are persisted by Axon, and propagated out to other components (possibly on other VMs). In event-sourcing, events are the sole records in the system. They are used by the system to describe and re-build domain aggregates on demand, one event at a time.\r\n\r\n## Development\r\n\r\nThis project is driven using [Maven][mvn].\r\n\r\n[mvn]: https:\/\/maven.apache.org\/\r\n\r\n### Run\/Install locally\r\n \r\nMake sure that you have this libraries installed in your local maven repository:\r\n\r\n - [my-company-common](https:\/\/github.com\/ivans-innovation-lab\/my-company-common)\r\n\r\n```bash\r\n$ .\/mvnw clean install\r\n```\r\n\r\n### Run tests\r\n\r\nThis component comes with some rudimentary tests as a good starting\r\npoint for writing your own.  Use the following command to execute the\r\ntests using Maven:\r\n\r\n```bash\r\n$ .\/mvnw test\r\n```\r\n\r\n---\r\nCreated by [Ivan Dugalic][idugalic]@[lab][lab].\r\nNeed Help?  [Join our Slack team][slack].\r\n\r\n[idugalic]: http:\/\/idugalic.pro\r\n[lab]: http:\/\/lab.idugalic.pro\r\n[slack]: https:\/\/join.slack.com\/t\/idugalic\/signup');
}

/**
 * Remove content from CHANGELOG specific to this project.
 *
 * @param project  Project whose README should be cleaned.
 * @param owner    GitHub owner of newly created project.
 */
export function cleanChangeLog(project: Project, owner: string): void {
    const changeLog: File = project.findFile("CHANGELOG.md");
    const middleContentRE = "\\d+\\.\\d+\\.\\d+\\.\\.\\.HEAD\n\n[\\S\\s]*## \\[0\\.1\\.0\\]";
    changeLog.regexpReplace(middleContentRE, "0.1.0...HEAD\n\n## [0.1.0]");
    changeLog.regexpReplace("\n### Added[\\S\\s]*", "\nAdded\n\n-   Everything\n");
    changeLog.replace("spring-rugs", project.name);
    changeLog.replace("atomist-rugs", owner);
}

/**
 * Update the .circleci/config.yml with new project information.
 *
 * @param project  Project whose README should be cleaned.
 * @param artifactId   Maven artifact identifier.
 * @param owner    GitHub owner of newly created project.
 */
export function updateCircleCI(project: Project, artifactId: string): void {
    const circleCI: File = project.findFile(".circleci/config.yml");
    circleCI.replace("my-company-domain", artifactId);
}

/**
 * Remove files specific to this project.
 *
 * @param project  Project whose README should be cleaned.
 */
export function removeUnnecessaryFiles(project: Project): void {
    const toDelete: string[] = [
        "LICENSE",
        "CODE_OF_CONDUCT.md",
        "CONTRIBUTING.md",
        ".travis.yml",
    ];
    toDelete.forEach(f => project.deleteFile(f));
}

/**
 * Update the pom.xml with new project information.
 *
 * @param project      Project whose POM should be cleaned.
 * @param artifactId   Maven artifact identifier.
 * @param groupId      Maven group identifier.
 * @param version      Project version.
 * @param description  Brief description of newly created project.
 */
export function updatePom(
    project: Project,
    artifactId: string,
    groupId: string,
    version: string,
    description: string): void {

    const eng: PathExpressionEngine = project.context.pathExpressionEngine;
    eng.with<Pom>(project, "/Pom()", pom => {
        pom.setArtifactId(artifactId);
        pom.setGroupId(groupId);
        pom.setProjectName(project.name);
        pom.setVersion(version);
        pom.setDescription(description);
    });
}

/**
 * Move files from on Java package to another.
 *
 * @param project      Project whose README should be cleaned.
 * @param oldPackage   Name of package to move from.
 * @param newPackage   Name of package to move to.
 */
export function movePackage(project: Project, oldPackage: string, newPackage: string): void {
    const eng: PathExpressionEngine = project.context.pathExpressionEngine;
    eng.with<JavaSource>(project, `//JavaSource()[.pkg()='${oldPackage}']`, j => {
        j.movePackage(newPackage);
    });
}

/**
 * Rename all instances of a Java Class.  This method is somewhat
 * surgical when replacing appearances in Java code but brutal when
 * replacing appearances elsewhere, i.e., it uses `Project.replace()`.
 *
 * @param project    Project whose README should be cleaned.
 * @param oldClass   Name of class to move from.
 * @param newClass   Name of class to move to.
 */
export function renameClass(project: Project, oldClass: string, newClass: string): void {
    const eng: PathExpressionEngine = project.context.pathExpressionEngine;
    eng.with<JavaType>(project, `//JavaType()`, j => {
        if (j.name.indexOf(oldClass) >= 0) {
            j.renameByReplace(oldClass, newClass);
        }
    });
    project.replace(oldClass, newClass);
}
