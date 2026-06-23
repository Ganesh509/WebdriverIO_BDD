/**
 * LoginPage - Page Object for login functionality
 */
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor() {
    super('https://practice.saucedemo.com');
  }

  // UI Element locators
  get usernameInput() {
    return $('[data-test="username"]');
  }

  get passwordInput() {
    return $('[data-test="password"]');
  }

  get loginButton() {
    return $('[data-test="login-button"]');
  }

  get errorContainer() {
    return $('[data-test="error"]');
  }

  get dashboard() {
    return $('.inventory_container');
  }

  get pageHeader() {
    return $('.app_logo');
  }

  /**
   * Perform login with username and password
   */
  async login(username, password) {
    try {
      await this.setInputValue(this.usernameInput, username);
      await this.setInputValue(this.passwordInput, password);
      await this.clickElement(this.loginButton);

      // Wait for navigation to complete
      await browser.waitUntil(
        async () => {
          const url = await browser.getUrl();
          return url.includes('inventory') || url.includes('error');
        },
        { timeout: 10000, timeoutMsg: 'Navigation did not complete after login' }
      );
    } catch (error) {
      await this.takeScreenshot('login-failed');
      throw error;
    }
  }

  /**
   * Get error message text
   */
  async getErrorMessage() {
    try {
      await this.waitForElement(this.errorContainer);
      return await this.getElementText(this.errorContainer);
    } catch (error) {
      console.warn('No error message found:', error.message);
      return null;
    }
  }

  /**
   * Check if error message is displayed
   */
  async isErrorDisplayed() {
    return await this.isElementDisplayed(this.errorContainer);
  }

  /**
   * Check if dashboard is displayed
   */
  async isDashboardDisplayed() {
    return await this.isElementDisplayed(this.dashboard);
  }

  /**
   * Get page header text
   */
  async getHeaderText() {
    return await this.getElementText(this.pageHeader);
  }
}

module.exports = LoginPage;

