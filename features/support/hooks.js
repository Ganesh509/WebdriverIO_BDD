/**
 * Cucumber Hooks - Setup and teardown for scenarios
 */

const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');

// Set default timeout to 60 seconds
setDefaultTimeout(60 * 1000);

/**
 * Before Hook - Runs before each scenario
 */
Before(async function(scenario) {
  console.log(`\n▶ Starting scenario: "${scenario.pickle.name}"`);
  console.log(`  Tags: ${scenario.pickle.tags.map(t => t.name).join(', ') || 'none'}`);
});

/**
 * After Hook - Runs after each scenario
 */
After(async function(scenario) {
  console.log(`\n◀ Completed scenario: "${scenario.pickle.name}"`);
  console.log(`  Status: ${scenario.result.status}`);

  // Take screenshot on failure
  if (scenario.result.status === 'FAILED') {
    console.log('  ❌ Taking screenshot for failed scenario...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = `failed-${scenario.pickle.name.replace(/\s+/g, '-')}-${timestamp}`;

    try {
      await browser.saveScreenshot(`./reports/${screenshotName}.png`);
      console.log(`  Screenshot saved: ${screenshotName}.png`);
    } catch (error) {
      console.error('  Failed to take screenshot:', error.message);
    }
  }

  // Close any open alerts
  try {
    const alert = await browser.getAlertText().catch(() => null);
    if (alert) {
      await browser.dismissAlert();
    }
  } catch (error) {
    // No alert present
  }

  // Reset to default content
  try {
    await browser.switchToParentFrame();
  } catch (error) {
    // Already in parent frame
  }
});
