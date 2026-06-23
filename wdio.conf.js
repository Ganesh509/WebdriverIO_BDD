require('dotenv').config();

const useDocker = process.env.USE_DOCKER === 'true';

exports.config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  runner: 'local',

  // Connection configuration - auto-detect Docker vs local
  protocol: useDocker ? (process.env.SELENIUM_PROTOCOL || 'http') : 'http',
  hostname: useDocker ? (process.env.SELENIUM_HOST || 'localhost') : 'localhost',
  port: useDocker ? (process.env.SELENIUM_PORT || 4444) : 9515,
  path: useDocker ? '/wd/hub' : '/',

  // Base URL for tests
  baseUrl: process.env.BASE_URL || 'https://practice.saucedemo.com',

  //
  // ==================
  // Specify Test Files
  // ==================
  specs: [
    './features/**/*.feature'
  ],
  exclude: [
    './features/**/*.disabled.feature'
  ],

  //
  // ============
  // Capabilities
  // ============
  maxInstances: process.env.CI === 'true' ? 3 : 1,
  maxInstancesPerCapability: process.env.CI === 'true' ? 2 : 1,

  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: [
        ...(process.env.HEADLESS !== 'false' ? ['--headless'] : []),
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080'
      ]
    }
  }],

  //
  // ===================
  // Test Configurations
  // ===================
  logLevel: process.env.LOG_LEVEL || 'warn',
  bail: 0,
  waitforTimeout: parseInt(process.env.WAIT_FOR_TIMEOUT || '10000'),
  connectionRetryTimeout: parseInt(process.env.CONNECTION_RETRY_TIMEOUT || '120000'),
  connectionRetryCount: parseInt(process.env.CONNECTION_RETRY_COUNT || '3'),

  // Retry strategy
  specFileRetries: process.env.CI === 'true' ? 2 : 0,
  specFileRetriesDeferred: true,

  //
  // Framework and Reporters
  // ======================
  framework: 'cucumber',

  reporters: [
    'spec',
    ['allure', {
      outputDir: process.env.REPORT_DIR || 'allure-results',
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: process.env.SCREENSHOT_ON_FAILURE !== 'false',
      issueLinkTemplate: 'https://github.com/Ganesh509/WebdriverIO_BDD/issues/{}',
      tmsLinkTemplate: 'https://github.com/Ganesh509/WebdriverIO_BDD/issues/{}'
    }]
  ],

  //
  // Cucumber Configuration
  // ======================
  cucumberOpts: {
    require: [
      './features/step-definitions/**/*.js',
      './features/support/**/*.js'
    ],
    backtrace: true,
    failFast: process.env.FAIL_FAST === 'true',
    strict: true,
    timeout: 60000,
    tagExpression: process.env.TAGS || '',
    snippets: true,
    source: true,
    dryRun: false,
    ignoreUndefinedDefinitions: false
  },

  //
  // =====
  // Hooks
  // =====
  beforeScenario: async (world) => {
    console.log(`Starting scenario: ${world.pickle.name}`);
  },

  afterScenario: async (world, result) => {
    if (result.status === 'FAILED') {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await browser.saveScreenshot(`./reports/failed-${timestamp}.png`);
    }
  },

  onComplete: (exitCode, config, capabilities, results) => {
    console.log('Test run completed');
    if (exitCode !== 0) {
      console.error(`Run failed with exit code ${exitCode}`);
    }
  }
};

