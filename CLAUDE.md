# WebdriverIO BDD Framework Standards

## Framework Guidelines

This document defines the standards and best practices for this WebdriverIO BDD testing framework.

---

## 1. File Organization

### Directory Structure

```
features/
├── *.feature                 # Feature files (one per feature)
├── pageobjects/
│   ├── BasePage.js          # Base class (do not modify)
│   └── [feature].page.js    # Page objects (one per page)
├── step-definitions/
│   └── steps.js             # All step definitions
└── support/
    ├── test-data.js         # Test data and fixtures
    └── hooks.js             # Cucumber hooks
```

### Naming Conventions

- **Features**: lowercase with hyphens: `user-login.feature`, `checkout.feature`
- **Page Objects**: feature name + "page" + lowercase: `login.page.js`, `checkout.page.js`
- **Step Definitions**: feature name + "steps" (optional): `login.steps.js`
- **Test Data**: `test-data.js` (centralized)
- **Classes**: PascalCase: `BasePage`, `LoginPage`, `CheckoutPage`
- **Methods**: camelCase: `login()`, `getErrorMessage()`, `isDisplayed()`
- **Constants**: UPPER_SNAKE_CASE: `TIMEOUT`, `WAIT_TIME`

---

## 2. Feature Files (Gherkin)

### Structure

```gherkin
Feature: Descriptive feature name
  As a [user type]
  I want to [action]
  So that [benefit]

  Background:
    # Common setup for all scenarios
    Given I navigate to the login page

  @tag1 @tag2
  Scenario: Clear description of what is tested
    Given [initial context]
    When [action is taken]
    Then [outcome is verified]
```

### Best Practices

✅ **Do:**
- Use real user language (non-technical)
- One scenario = one behavior to test
- Be specific with test data
- Use meaningful tag names
- Include Background for common setup

❌ **Don't:**
- Use vague names like "Test login"
- Mix multiple behaviors in one scenario
- Use hardcoded values in feature files (use Given steps)
- Leave scenarios incomplete
- Use technical jargon

### Tag Strategy

```gherkin
@smoke            # Quick tests - run on every commit
@regression       # Full test suite - run on main branch
@critical         # Must pass always
@wip              # Work in progress
@flaky            # Known flaky tests - allow retries
@login            # Feature area
@valid            # Positive test case
@invalid          # Negative test case
```

---

## 3. Page Objects

### Template

```javascript
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor() {
    super('https://practice.saucedemo.com');
  }

  // Element getters (no logic)
  get usernameInput() {
    return $('[data-test="username"]');
  }

  get passwordInput() {
    return $('[data-test="password"]');
  }

  // Action methods
  async login(username, password) {
    await this.setInputValue(this.usernameInput, username);
    await this.setInputValue(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  // Verification methods
  async isDashboardDisplayed() {
    return await this.isElementDisplayed(this.dashboard);
  }
}

module.exports = LoginPage;
```

### Best Practices

✅ **Do:**
- Extend BasePage for common functionality
- Use descriptive getter names
- Return page objects from navigation methods
- Use async/await consistently
- Add error handling and logging
- Include JSDoc comments

❌ **Don't:**
- Perform assertions in page objects
- Use synchronous code
- Hardcode wait times (use BasePage methods)
- Include business logic
- Duplicate code (use BasePage methods)

### Element Locators

Prefer data attributes over CSS/XPath:

```javascript
// ✅ Good
get submitButton() {
  return $('[data-test="submit-btn"]');
}

// ⚠️ Acceptable
get submitButton() {
  return $('button.submit-btn');
}

// ❌ Avoid
get submitButton() {
  return $('//button[contains(text(), "Submit")]');
}
```

---

## 4. Step Definitions

### Template

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const LoginPage = require('../pageobjects/login.page');

const loginPage = new LoginPage();

// Given steps - setup/navigation
Given('I navigate to the login page', async () => {
  await loginPage.open();
});

// When steps - user actions
When('I enter username {string}', async (username) => {
  await loginPage.setInputValue(loginPage.usernameInput, username);
});

// Then steps - assertions
Then('I should see the dashboard', async () => {
  const isDisplayed = await loginPage.isDashboardDisplayed();
  expect(isDisplayed).to.be.true;
});
```

### Best Practices

✅ **Do:**
- Reuse page objects
- Add error handling with try-catch
- Take screenshots on failure
- Use meaningful assertion messages
- Keep steps focused and reusable
- Use Cucumber expressions: `{string}`, `{int}`

❌ **Don't:**
- Hardcode selectors in steps
- Mix multiple assertions in one step
- Use implicit waits
- Skip error handling
- Create one-off steps for single scenarios

---

## 5. Test Data Management

### Structure

```javascript
// features/support/test-data.js
const testUsers = {
  validUser: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  invalidUser: {
    username: 'invalid_user',
    password: 'wrong'
  }
};

module.exports = { testUsers, errorMessages };
```

### Usage in Steps

```javascript
const { testUsers } = require('../support/test-data');

When('I login with valid credentials', async () => {
  await loginPage.login(testUsers.validUser.username, testUsers.validUser.password);
});
```

---

## 6. Error Handling & Logging

### Use Try-Catch for Page Actions

```javascript
async login(username, password) {
  try {
    await this.setInputValue(this.usernameInput, username);
    await this.setInputValue(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  } catch (error) {
    await this.takeScreenshot('login-failed');
    console.error(`Login failed: ${error.message}`);
    throw error;
  }
}
```

### Logging

```javascript
// Use console for debugging
console.log('User logged in successfully');
console.warn('Element not found, retrying...');
console.error('Critical error occurred:', error.message);

// Logging is environment-controlled
// LOG_LEVEL=warn will show warn and error only
```

---

## 7. Code Quality

### Run Linting

```bash
npm run lint        # Check and fix ESLint issues
npm run format      # Format with Prettier
```

### ESLint Rules

- Use semicolons
- Use single quotes
- 2-space indentation
- No console.log in committed code (warn only)
- Const > let > var

### Code Review Checklist

- [ ] Feature file has descriptive name and tags
- [ ] All scenarios have concrete examples (not hardcoded steps)
- [ ] Page object extends BasePage
- [ ] Step definitions use page objects
- [ ] Error handling with try-catch
- [ ] No hardcoded values (use test-data.js)
- [ ] Screenshots taken on failure
- [ ] Code passes linting
- [ ] Meaningful commit messages

---

## 8. Writing Good Scenarios

### ❌ Bad Example

```gherkin
Scenario: Test
  Given I open the app
  When I do something
  Then it should work
```

### ✅ Good Example

```gherkin
@smoke @login @critical
Scenario: User can log in with valid credentials
  Given I navigate to the Swag Labs login page
  When I enter username "standard_user"
  And I enter password "secret_sauce"
  And I click the login button
  Then I should see the products inventory page
  And I should see "Products" header
```

---

## 9. Running Tests

### Local Execution

```bash
# All tests
npm test

# By tag
npm run test:smoke
npm test -- --grep @regression

# Debug mode
npm run test:debug

# Parallel
npm run test:parallel
```

### CI/CD Execution

```bash
# Jenkins will run based on branch
# - main: Full regression suite
# - feature/*: Smoke tests only
```

---

## 10. Reporting & Screenshots

### Screenshots Auto-Saved On Failure

- Location: `./reports/` or `./allure-results/`
- Naming: `failed-<scenario-name>-<timestamp>.png`
- Automatically included in Allure report

### View Reports

```bash
npm run report:allure
```

---

## 11. Common Commands

```bash
# Development
npm install              # Install dependencies
npm test                 # Run all tests
npm run lint            # Check code quality
npm run format          # Auto-format code

# Testing
npm run test:smoke      # Smoke tests only
npm run test:docker     # Tests in Docker
npm run test:debug      # Debug mode

# Reporting
npm run report:allure   # Generate report
npm run clean           # Clean build artifacts

# Maintenance
npm audit               # Check for vulnerabilities
git log -n 5           # View recent commits
```

---

## 12. Troubleshooting

### Common Issues

**Tests fail with "Element not found"**
- Increase `waitforTimeout` in wdio.conf.js
- Check selector correctness
- Ensure page has loaded

**Port 4444 already in use**
```bash
lsof -i :4444
kill -9 <PID>
```

**Screenshots not saving**
```bash
mkdir -p reports
chmod 755 reports
```

---

## 13. Resources

- [WebdriverIO Docs](https://webdriver.io/)
- [Cucumber Docs](https://cucumber.io/)
- [Chai Assertions](https://www.chaijs.com/)
- [Allure Report](https://qameta.io/allure/)

---

## 14. Framework Support

For questions or issues:
1. Read README.md
2. Check existing test examples
3. Review STANDARDS_REVIEW.md
4. Create GitHub issue

---

**Last Updated:** 2026-06-23
