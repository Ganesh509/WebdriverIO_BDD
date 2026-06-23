/**
 * BasePage class - Base class for all page objects
 * Provides common functionality for all pages
 */
class BasePage {
  constructor(url = '/') {
    this.url = url;
  }

  /**
   * Navigate to the page URL
   */
  async open() {
    try {
      await browser.url(this.url);
      await this.waitForPageLoad();
    } catch (error) {
      console.error(`Failed to open page at ${this.url}:`, error.message);
      throw error;
    }
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad(timeout = 10000) {
    try {
      await browser.waitUntil(
        async () => {
          const readyState = await browser.execute(() => document.readyState);
          return readyState === 'complete';
        },
        { timeout, timeoutMsg: 'Page did not load within timeout' }
      );
    } catch (error) {
      console.warn('Page load wait timed out:', error.message);
    }
  }

  /**
   * Get page title
   */
  async getTitle() {
    return await browser.getTitle();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl() {
    return await browser.getUrl();
  }

  /**
   * Wait for element to be displayed
   */
  async waitForElement(element, timeout = 10000) {
    try {
      await element.waitForDisplayed({ timeout });
      return element;
    } catch (error) {
      console.error('Element did not appear within timeout:', error.message);
      throw error;
    }
  }

  /**
   * Wait for element to be enabled
   */
  async waitForElementClickable(element, timeout = 10000) {
    try {
      await element.waitForClickable({ timeout });
      return element;
    } catch (error) {
      console.error('Element is not clickable within timeout:', error.message);
      throw error;
    }
  }

  /**
   * Click an element with wait
   */
  async clickElement(element) {
    try {
      await this.waitForElementClickable(element);
      await element.click();
    } catch (error) {
      console.error('Failed to click element:', error.message);
      throw error;
    }
  }

  /**
   * Set value for input field
   */
  async setInputValue(element, value) {
    try {
      await this.waitForElement(element);
      await element.clearValue();
      await element.setValue(value);
    } catch (error) {
      console.error(`Failed to set value "${value}" to element:`, error.message);
      throw error;
    }
  }

  /**
   * Get element text
   */
  async getElementText(element) {
    try {
      await this.waitForElement(element);
      return await element.getText();
    } catch (error) {
      console.error('Failed to get element text:', error.message);
      throw error;
    }
  }

  /**
   * Check if element is displayed
   */
  async isElementDisplayed(element) {
    try {
      return await element.isDisplayed();
    } catch {
      return false;
    }
  }

  /**
   * Switch to iframe
   */
  async switchToFrame(frameElement) {
    try {
      await browser.switchToFrame(frameElement);
    } catch (error) {
      console.error('Failed to switch to frame:', error.message);
      throw error;
    }
  }

  /**
   * Switch to parent frame
   */
  async switchToParentFrame() {
    try {
      await browser.switchToParentFrame();
    } catch (error) {
      console.error('Failed to switch to parent frame:', error.message);
      throw error;
    }
  }

  /**
   * Take screenshot with descriptive name
   */
  async takeScreenshot(name) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${name}-${timestamp}.png`;
      await browser.saveScreenshot(`./reports/${filename}`);
      console.log(`Screenshot saved: ${filename}`);
      return filename;
    } catch (error) {
      console.error('Failed to take screenshot:', error.message);
    }
  }

  /**
   * Scroll to element
   */
  async scrollToElement(element) {
    try {
      await element.scrollIntoView();
    } catch (error) {
      console.error('Failed to scroll to element:', error.message);
      throw error;
    }
  }

  /**
   * Pause execution
   */
  async pause(ms = 1000) {
    await browser.pause(ms);
  }

  /**
   * Get all text from page
   */
  async getPageText() {
    return await browser.getText('body');
  }

  /**
   * Check if text exists on page
   */
  async isTextOnPage(text) {
    const pageText = await this.getPageText();
    return pageText.includes(text);
  }
}

module.exports = BasePage;
