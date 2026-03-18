const LoginPage = require('../pageobjects/login.page.js');
const { Given, When, Then } = require('@cucumber/cucumber');
// const { expect } = require('chai');

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
