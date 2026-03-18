export default class LoginPage {
    get username() { return $('#username'); }
    get password() { return $('#password'); }
    get loginBtn() { return $('#loginBtn'); }
    get dashboard() { return $('#dashboard'); }

    async open() {
        await browser.url('https://www.google.com/');
    }

    async login(username, password) {
        await this.username.setValue(username);
        await this.password.setValue(password);
        await this.loginBtn.click();
    }
}

module.exports = new LoginPage();
