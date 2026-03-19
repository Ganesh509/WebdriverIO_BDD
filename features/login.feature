Feature: Login

  Scenario: User can login
    Given I open login page
    #When I login with username "user1" and password "password1"
    #Then I should see dashboard

    Scenario: User can invalid login
    Given I open login page
    When I login with username "user1" and password "password1"
