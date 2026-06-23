const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const LoginPage = require('../pageobjects/login.page');

const loginPage = new LoginPage();

/**
 * Given Steps - Setup/Navigation
 */
Given('I navigate to the login page', async () => {
  try {
    await loginPage.open();
    const isDisplayed = await loginPage.isElementDisplayed(loginPage.usernameInput);
    expect(isDisplayed).to.be.true;
  } catch (error) {
    console.error('Failed to navigate to login page:', error.message);
    throw error;
  }
});

/**
 * When Steps - User Actions
 */
When('I enter username {string}', async (username) => {
  try {
    await loginPage.setInputValue(loginPage.usernameInput, username);
  } catch (error) {
    console.error(`Failed to enter username "${username}":`, error.message);
    throw error;
  }
});

When('I enter password {string}', async (password) => {
  try {
    await loginPage.setInputValue(loginPage.passwordInput, password);
  } catch (error) {
    console.error(`Failed to enter password:`, error.message);
    throw error;
  }
});

When('I click the login button', async () => {
  try {
    await loginPage.clickElement(loginPage.loginButton);
  } catch (error) {
    console.error('Failed to click login button:', error.message);
    throw error;
  }
});

/**
 * Then Steps - Assertions
 */
Then('I should see the dashboard', async () => {
  try {
    const isDashboardDisplayed = await loginPage.isDashboardDisplayed();
    expect(isDashboardDisplayed).to.be.true;
  } catch (error) {
    await loginPage.takeScreenshot('dashboard-not-visible');
    console.error('Dashboard not displayed:', error.message);
    throw error;
  }
});

Then('I should see {string} in the header', async (expectedText) => {
  try {
    const headerText = await loginPage.getHeaderText();
    expect(headerText).to.include(expectedText);
  } catch (error) {
    await loginPage.takeScreenshot('header-text-not-found');
    console.error(`Expected text "${expectedText}" not found in header:`, error.message);
    throw error;
  }
});

Then('I should see error message {string}', async (expectedError) => {
  try {
    const isErrorDisplayed = await loginPage.isErrorDisplayed();
    expect(isErrorDisplayed).to.be.true;

    const actualError = await loginPage.getErrorMessage();
    expect(actualError).to.equal(expectedError);
  } catch (error) {
    await loginPage.takeScreenshot('error-message-assertion-failed');
    console.error(`Expected error message "${expectedError}" not found:`, error.message);
    throw error;
  }
});

Then('I should remain on the login page', async () => {
  try {
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).to.include('saucedemo.com');

    const isUsernameInputVisible = await loginPage.isElementDisplayed(loginPage.usernameInput);
    expect(isUsernameInputVisible).to.be.true;
  } catch (error) {
    console.error('Not on login page:', error.message);
    throw error;
  }
});

