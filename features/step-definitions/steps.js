import { Given, When, Then } from '@wdio/cucumber-framework';
// steps.js
import LoginPage from '../../pageobjects/login.page.js'; // must include .js
import { expect } from 'chai';

Given('I open the login page', async () => {
    await LoginPage.open();
});

When('I login with username {string} and password {string}', async (username, password) => {
    // Page Object handles typing and clicking
    await LoginPage.login(username, password);
});

Then('I should see the dashboard', async () => {
    try {
        const isDisplayed = await LoginPage.isDashboardDisplayed();
        expect(isDisplayed).to.be.true;
    } catch (error) {
        // Save screenshot if dashboard not displayed
        await browser.saveScreenshot(`./errorShots/dashboard_failure_${Date.now()}.png`);
        throw error; // Rethrow to fail the test
    }
});
