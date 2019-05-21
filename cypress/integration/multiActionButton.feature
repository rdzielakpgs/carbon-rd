Feature: Multi Action Button component
  I want to change Multi Action Button component properties

  Background: Open Multi Action Button component page
    Given I open "Multi Action Button" component page

  @positive
  Scenario Outline: Change Multi Action Button text
    When I set text to "<text>"
    Then Multi Action Button text on preview is set to "<text>"
    Examples:
      | text                    |
      | Sample text             |
      | 1234567890              |
      | áéíóú¿¡üñ               |
      | !@#$%^*()_+-=~[];:.,?{} |
      | ÄÖÜßäöüß                |
      | <>                      |

@positive
  Scenario Outline: Change as property of Multi Action Button component
    When I select as to "<asProperty>"
    Then Multi Action Button as on preview is "<asProperty>"
    Examples:
      | asProperty  |
      | primary     |
      | secondary   |
      | transparent |

@positive
  Scenario Outline: Check <align> property of Multi Action Button component
    When I select align to "<align>"
    Then Multi Action Button align on preview is "<align>"
     Examples:
      | align |
      | left  |
      | right |

  @positive
  Scenario: Check disabled state of Multi Action Button component
    When I disable disabled component
    Then Multi Action Button is disabled

  @positive
  Scenario: Uncheck disabled state of Multi Action Button component
    When  I disable disabled component
      And I enable disabled component
    Then Multi Action Button is not disabled

  @positive
  Scenario: Invoking Multi Action Button component
    When I invoke Multi Action Button component
    Then Multi Action Button is expanded and contains three items