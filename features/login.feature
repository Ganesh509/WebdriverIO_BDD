Feature: User Login
  As a user
  I want to log in to the application
  So that I can access my dashboard

  Background:
    Given I navigate to the login page

  @smoke @critical @login
  Scenario: User successfully logs in with valid credentials
    When I enter username "standard_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see the dashboard
    And I should see "Swag Labs" in the header

  @regression @login
  Scenario: User sees error with invalid credentials
    When I enter username "invalid_user"
    And I enter password "wrong_password"
    And I click the login button
    Then I should see error message "Username and password do not match"
    And I should remain on the login page
