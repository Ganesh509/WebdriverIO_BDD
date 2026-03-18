import LoginPage from '../../pageobjects/login.page.js';
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

const loginPage = new LoginPage();

Given('I open login page', async () => {
    await loginPage.open();
});

When('I login with username {string} and password {string}', async (username, password) => {
    await loginPage.login(username, password);
});

Then('I should see dashboard', async () => {
    await expect(await loginPage.dashboard.isDisplayed()).to.be.true;
});
