Feature: Menulist component
  I want to change MenuList component properties

  Background: Open MenuList component page
    Given I open "MenuList" component page

  @positive
  Scenario Outline: Change MenuList title
    When I set title to "<title>"
    Then title on preview is "<title>"
    Examples:
      | title                    |
      | Sample text              |
      | 1234567890               |
      | áéíóú¿¡üñ                |
      | !@#$%^*()_+-=~[];:.,?{}  |
      | ÄÖÜßäöüß                 |
      | <>                       |

  @ignore
  # @positive doesn't work on Carbon Demo site
  Scenario Outline: Change MenuList filterPlaceholder
    When I set filterPlaceholder to "<text>"
    Then filterPlaceholder on preview is "<text>"
    Examples:
      | text                     |
      | Sample text              |
      | 1234567890               |
      | áéíóú¿¡üñ                |
      | !@#$%^*()_+-=~[];:.,?{}  |
      | ÄÖÜßäöüß                 |
      | <>                       |

  @positive
  Scenario Outline: Check search field
    When I click into menu item second element
      And I change search parameter to "<parameter>"
    Then search result is "<result>"
    Examples:
      | parameter | result          |
      | Fir       | First Sub Item  |
      | Sec       | Second Sub Item |
      | Thi       | Third Sub Item  |

  @ignore
  # @positive doesn't work on Carbon Demo site
  Scenario: enable initially open
    When I check initiallyOpen checkbox
    Then MenuList component is expanded

  @ignore
  # @positive doesn't work on Carbon Demo site
  Scenario: enable and disable innitially open
    When I check initiallyOpen checkbox
      And I uncheck initiallyOpen checkbox
    Then MenuList component is not expanded

  @positive
  Scenario: disable fiter
    When I uncheck filter checkbox
      And I click into menu item second element
    Then filter is disabled

  @positive
  Scenario: disable and enable filter
    When I uncheck filter checkbox
      And I check filter checkbox
      And I set title to "title"
      And I click into menu item second element
    Then filter is enabled

  @positive
  Scenario: disable collapsible
    When I set title to "title"
      And I uncheck collapsible checkbox
      And I click into title
    Then MenuList component is expanded