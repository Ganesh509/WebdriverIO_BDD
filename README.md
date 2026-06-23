# WebdriverIO BDD Framework

A modern, standards-compliant BDD (Behavior-Driven Development) testing framework built with WebdriverIO, Cucumber, and Node.js for end-to-end testing.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Tags](#test-tags)
- [Environment Configuration](#environment-configuration)
- [Page Object Model](#page-object-model)
- [Writing Tests](#writing-tests)
- [Docker Setup](#docker-setup)
- [CI/CD Integration](#cicd-integration)
- [Reporting](#reporting)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/Ganesh509/WebdriverIO_BDD.git
cd WebdriverIO_BDD

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run all tests
npm test

# View Allure report
npm run report:allure
```

## 📁 Project Structure

```
features/
├── login.feature                      # Feature files (Gherkin syntax)
├── checkout.feature
├── pageobjects/
│   ├── BasePage.js                   # Base class for page objects
│   ├── login.page.js                 # Login page object
│   ├── dashboard.page.js             # Dashboard page object
│   └── checkout.page.js              # Checkout page object
├── step-definitions/
│   ├── steps.js                      # Step definitions (Given/When/Then)
│   └── login.steps.js                # Feature-specific steps (optional)
└── support/
    ├── test-data.js                  # Test data and fixtures
    └── hooks.js                      # Before/After hooks

config/
└── wdio.conf.js                      # WebdriverIO configuration

reports/
├── allure-results/                   # Test execution results
└── allure-report/                    # Generated HTML report

.env.example                          # Environment template
.eslintrc.json                        # ESLint configuration
.prettierrc                           # Code formatting rules
package.json                          # Dependencies and scripts
Jenkinsfile                           # CI/CD pipeline
```

## 📦 Installation

### Prerequisites
- Node.js 18+ (or via NVM)
- npm 9+
- Chrome browser (for local testing)
- Java 8+ (for Allure reporting)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Step 3: Verify Installation

```bash
npm test
```

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests by Tag

```bash
# Smoke tests only
npm run test:smoke

# Regression tests
npm run test:regression

# Custom tag expression
npm test -- --grep @critical

# Multiple tags (OR operation)
npm test -- --grep "@smoke|@critical"

# Multiple tags (AND operation)
npm test -- --grep "@login.*@valid"
```

### Run Tests in Parallel

```bash
npm run test:parallel
```

### Run with Debug Mode

```bash
npm run test:debug
```

### Run Tests in Docker

```bash
npm run test:docker
```

## 🏷️ Test Tags

Use tags to organize and filter tests:

```gherkin
@smoke           # Quick regression (5-10 tests) - run on every commit
@regression      # Full test suite - run on main branch
@critical        # Critical path tests - must always pass
@wip            # Work in progress - skip in CI
@flaky          # Known flaky tests - allow retries
@performance    # Performance/load tests
@accessibility  # Accessibility tests
@api            # API integration tests
@ui             # UI tests only
@login          # Feature-specific tags
```

### Tag Expression Examples

```bash
# Run smoke tests
npm test -- --grep "@smoke"

# Skip WIP tests
npm test -- --grep "not @wip"

# Critical tests but not flaky
npm test -- --grep "@critical and not @flaky"

# Smoke OR critical tests
npm test -- --grep "@smoke or @critical"
```

## 🔧 Environment Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Application
BASE_URL=https://practice.saucedemo.com

# Selenium
SELENIUM_HOST=localhost
SELENIUM_PORT=4444

# Browser
HEADLESS=true
CHROME_ARGS=--disable-dev-shm-usage,--no-sandbox

# Timeouts
WAIT_FOR_TIMEOUT=10000

# Logging
LOG_LEVEL=warn

# CI/CD
CI=false
```

See `.env.example` for all available options.

### Load Environment Variables

Environment variables are automatically loaded from `.env` file via `dotenv` package.

## 📄 Page Object Model

### BasePage Class

All page objects should extend `BasePage` for common functionality:

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
```

### Available BasePage Methods

```javascript
// Navigation
await page.open()                        // Open page URL
await page.getCurrentUrl()               // Get current URL
await page.getTitle()                    // Get page title

// Element Interactions
await page.waitForElement(element)       // Wait for element to display
await page.clickElement(element)         // Click element with wait
await page.setInputValue(element, text)  // Set input value
await page.getElementText(element)       // Get element text

// Assertions
await page.isElementDisplayed(element)   // Check if element visible
await page.isTextOnPage(text)            // Check if text on page

// Utilities
await page.takeScreenshot(name)          // Take screenshot
await page.scrollToElement(element)      // Scroll to element
await page.pause(1000)                   // Pause execution
```

## ✍️ Writing Tests

### Feature File (Gherkin)

```gherkin
Feature: User Authentication
  As a user
  I want to log in with valid credentials
  So that I can access my account

  Background:
    Given I navigate to the login page

  @smoke @critical
  Scenario: Successful login with valid credentials
    When I enter username "standard_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see the dashboard
    And I should see "Dashboard" in the header

  @regression
  Scenario: Unsuccessful login with invalid credentials
    When I enter username "invalid_user"
    And I enter password "wrong_password"
    And I click the login button
    Then I should see error message "Username and password do not match"
```

### Step Definitions (JavaScript)

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const LoginPage = require('../pageobjects/login.page');

const loginPage = new LoginPage();

When('I enter username {string}', async (username) => {
  await loginPage.setInputValue(loginPage.usernameInput, username);
});

When('I enter password {string}', async (password) => {
  await loginPage.setInputValue(loginPage.passwordInput, password);
});

Then('I should see dashboard', async () => {
  const isVisible = await loginPage.isDashboardDisplayed();
  expect(isVisible).to.be.true;
});
```

## 🐳 Docker Setup

### Run Tests in Container

```bash
docker-compose up
```

### View Browser via VNC

1. Connect VNC client to `localhost:7900`
2. Watch tests run in real-time (no password)

### Stop Services

```bash
docker-compose down
```

## 🔄 CI/CD Integration

### Jenkins

Pipeline is configured in `Jenkinsfile`:

```bash
stages:
  - Checkout Code
  - Install Dependencies
  - Code Quality (Lint)
  - Run Tests (Smoke)
  - Run Tests (Regression)
  - Generate Reports
```

### GitHub Actions

Run tests on every push and pull request:

```bash
# All tests
npm test

# Smoke tests only
npm run test:smoke
```

## 📊 Reporting

### Generate Allure Report

```bash
npm run report:allure
```

Opens browser with interactive test report showing:
- Test execution timeline
- Passed/Failed/Skipped tests
- Screenshots and logs
- Test trends

### Report Artifacts

- `allure-results/` - Raw test data
- `allure-report/` - Generated HTML report
- `reports/` - Screenshots from failed tests

## 🔍 Troubleshooting

### Tests Won't Start

```bash
# Check Chrome is running (Docker)
docker-compose up chrome

# Clear node_modules and reinstall
npm run clean && npm install

# Check firewall allows port 4444
lsof -i :4444
```

### Timeout Errors

```javascript
// Increase timeout in wdio.conf.js
waitforTimeout: 15000

// Or in individual steps
await browser.waitUntil(async () => {
  // condition
}, { timeout: 20000 });
```

### Port Already in Use

```bash
# Find process on port 4444
lsof -i :4444

# Kill process
kill -9 <PID>
```

### Screenshots Not Saving

```bash
# Ensure reports directory exists
mkdir -p reports

# Check file permissions
chmod -R 755 reports/
```

## 📚 Resources

- [WebdriverIO Documentation](https://webdriver.io/)
- [Cucumber.js Guide](https://cucumber.io/docs/cucumber/)
- [Chai Assertion Library](https://www.chaijs.com/)
- [Allure Report](https://docs.qameta.io/allure/)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Write tests in Gherkin format
3. Implement step definitions
4. Run tests: `npm test`
5. Lint code: `npm run lint`
6. Commit: `git commit -am 'Add my feature'`
7. Push and create Pull Request

## 📝 License

MIT License - See LICENSE file for details

## 👥 Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review existing test examples
3. Check framework documentation
4. Create GitHub issue

---

**Happy Testing! 🎉**
