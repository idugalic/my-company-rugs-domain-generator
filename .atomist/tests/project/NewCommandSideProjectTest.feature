Feature: NewCommandSideProject should generate a project
  This is the sample Gherkin feature file for the BDD tests of
  the Rug generator for a Spring Boot - Command Side project.
  Feel free to modify and extend to suit the needs of your generator.


  Scenario: NewCommandSideProject should create a new project based on this seed
    Given an empty project
    When NewCommandSideProject is run
    Then parameters were valid
    Then the README file exists
