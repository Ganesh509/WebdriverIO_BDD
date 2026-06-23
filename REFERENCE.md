# Framework Reference Guide

## ✅ All Available Methods & Classes

---

## BasePage.js - Common Methods

All page objects extend `BasePage` and have access to these methods:

### Navigation Methods
```javascript
await page.open()              // Opens page URL
await page.getCurrentUrl()     // Returns current URL
await page.getTitle()          // Returns page title
```

### Element Wait Methods
```javascript
await page.waitForElement(element, timeout)           // Wait for display
await page.waitForElementClickable(element, timeout)  // Wait for clickable
```

### Element Interaction Methods
```javascript
await page.clickElement(element)              // Click with auto-wait
await page.setInputValue(element, value)      // Set input + clear first
await page.getElementText(element)            // Get element text
await page.scrollToElement(element)           // Scroll to element
```

### Assertion Methods
```javascript
await page.isElementDisplayed(element)        // Check if visible (returns boolean)
await page.isTextOnPage(text)                 // Check if text exists on page
```

### Frame Methods
```javascript
await page.switchToFrame(frameElement)        // Switch to iframe
await page.switchToParentFrame()              // Switch back to parent
```

### Utility Methods
```javascript
await page.takeScreenshot(name)               // Save screenshot
await page.pause(milliseconds)                // Pause execution
await page.getPageText()                      // Get all page text
```

---

## LoginPage.js - Specific Methods

Extends `BasePage`, adding login-specific methods:

### Element Getters (Used in Steps)
```javascript
loginPage.usernameInput                // Username field
loginPage.passwordInput                // Password field
loginPage.loginButton                  // Login button
loginPage.errorContainer               // Error message area
loginPage.dashboard                    // Dashboard container
loginPage.pageHeader                   // Page header
```

### Action Methods
```javascript
await loginPage.login(username, password)     // Full login flow
```

### Verification Methods
```javascript
await loginPage.getErrorMessage()             // Get error text
await loginPage.isErrorDisplayed()            // Check if error shown
await loginPage.isDashboardDisplayed()        // Check if dashboard visible
await loginPage.getHeaderText()               // Get header text
```

---

## Test Data - test-data.js

Centralized test data:

```javascript
const { testUsers, credentials, errorMessages, testDataValidation } = require('../support/test-data');

// Available test users:
testUsers.validUser              // { username: 'standard_user', password: 'secret_sauce' }
testUsers.lockedUser             // { username: 'locked_out_user', password: 'secret_sauce' }
testUsers.problemUser            // { username: 'problem_user', password: 'secret_sauce' }
testUsers.invalidUser            // { username: 'invalid_user', password: 'wrong_password' }

// Available credentials:
credentials.empty                // { username: '', password: '' }
credentials.emptyPassword        // { username: 'standard_user', password: '' }
credentials.emptyUsername        // { username: '', password: 'secret_sauce' }

// Error messages:
errorMessages.invalidCredentials // 'Username and password do not match'
errorMessages.requiredUsername   // 'Username is required'
errorMessages.requiredPassword   // 'Password is required'
errorMessages.userLocked         // 'Sorry, this user has been locked out.'
```

---

## Steps Available - steps.js

All Gherkin steps that you can use in feature files:

### Given Steps (Setup)
```gherkin
Given I navigate to the login page
```

### When Steps (Actions)
```gherkin
When I enter username {string}
When I enter password {string}
When I click the login button
```

### Then Steps (Assertions)
```gherkin
Then I should see the dashboard
Then I should see {string} in the header
Then I should see error message {string}
Then I should remain on the login page
```

---

## Cucumber Hooks - hooks.js

Automatically runs before/after each scenario:

### Before Hook
- Logs scenario name and tags
- Sets implicit wait
- Initializes test context

### After Hook
- Logs scenario status
- Takes screenshot on failure
- Closes alerts
- Resets frame context

---

## Usage Examples in Steps

### Example 1: Using Page Object Methods
```javascript
Given('I navigate to the login page', async () => {
  await loginPage.open();                    // From BasePage
  const isDisplayed = await loginPage.isElementDisplayed(loginPage.usernameInput);  // From BasePage
});
```

### Example 2: Using Test Data
```javascript
When('I login with valid credentials', async () => {
  const user = testUsers.validUser;          // Get data
  await loginPage.login(user.username, user.password);
});
```

### Example 3: Using Assertions
```javascript
Then('I should see error message', async () => {
  const error = await loginPage.getErrorMessage();
  expect(error).to.equal(errorMessages.invalidCredentials);  // From chai
});
```

---

## Environment Variables - .env

Configuration available via environment:

```bash
# Application
BASE_URL                    # Application URL
SELENIUM_HOST              # Selenium server host
SELENIUM_PORT              # Selenium server port
HEADLESS                   # Run headless browser
LOG_LEVEL                  # Logging level (warn, info, debug)
WAIT_FOR_TIMEOUT           # Element wait timeout
CI                         # CI/CD mode flag
TAGS                       # Filter tests by tags
```

Usage in code:
```javascript
const baseUrl = process.env.BASE_URL || 'https://practice.saucedemo.com';
const headless = process.env.HEADLESS !== 'false';
```

---

## Common Patterns

### Pattern 1: Create New Page Object
```javascript
const BasePage = require('./BasePage');

class MyPage extends BasePage {
  constructor() {
    super('https://example.com/path');
  }

  get submitButton() {
    return $('button[type="submit"]');
  }

  async submit() {
    await this.clickElement(this.submitButton);
  }
}

module.exports = MyPage;
```

### Pattern 2: Add New Steps
```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const MyPage = require('../pageobjects/my.page');

const myPage = new MyPage();

When('I click submit', async () => {
  try {
    await myPage.submit();
  } catch (error) {
    console.error('Submit failed:', error.message);
    throw error;
  }
});
```

### Pattern 3: Add New Test Data
```javascript
// features/support/test-data.js
const myTestData = {
  scenario1: {
    input: 'value',
    expected: 'result'
  }
};

module.exports = { myTestData, ... };
```

---

## Troubleshooting References

### "ReferenceError: page is not defined"
**Solution:** Make sure page object is imported at top of steps.js
```javascript
const LoginPage = require('../pageobjects/login.page');
const loginPage = new LoginPage();
```

### "Cannot find module"
**Solutions:**
- Check file path is correct (relative from steps.js)
- Ensure file has `module.exports = ClassName;`
- Check spelling matches exactly

### "TypeError: await loginPage.method is not a function"
**Solutions:**
- Method doesn't exist in LoginPage or BasePage
- Check method name spelling
- Make sure method is `async`
- LoginPage should extend BasePage

### "Step definition not found"
**Solutions:**
- Step text in feature must match exactly
- Check wdio.conf.js includes step files
- Run `npm test` to see undefined steps

---

## Quick Checklist for New Tests

✅ Import LoginPage at top of steps.js
✅ Use `loginPage` (lowercase) variable
✅ Use methods from BasePage (inherit)
✅ Use methods from LoginPage (custom)
✅ Use test data from test-data.js (no hardcoding)
✅ Use `await` for all async calls
✅ Wrap steps in try-catch
✅ Match step text exactly in feature file
✅ Add descriptive error logging

---

## File Structure Reference

```
features/
├── login.feature                          # Gherkin scenarios
├── pageobjects/
│   ├── BasePage.js                       # ← All common methods here
│   └── login.page.js                     # ← Custom methods here
├── step-definitions/
│   └── steps.js                          # ← Step implementations here
└── support/
    ├── test-data.js                      # ← All test data here
    └── hooks.js                          # ← Before/After hooks
```

---

Last Updated: June 23, 2026
