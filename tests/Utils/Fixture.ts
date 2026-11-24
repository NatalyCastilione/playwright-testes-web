const base = require('@playwright/test');
const { APIUtils } = require('./APIUtils');

const loginPayload = { userEmail: "natalycastilione@hotmail.com", userPassword: "Teste@1234" };
const orderPayload = { orders: [{ country: "Brazil", productOrderedId: "6960eac0c941646b7a8b3e68" }] };

exports.customtest = base.test.extend({

    authenticatePage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto("https://rahulshettyacademy.com/client");
        await page.locator("#userEmail").fill(loginPayload.userEmail);
        await page.locator("#userPassword").fill(loginPayload.userPassword);
        await page.locator("[value='Login']").click();
        await page.waitForLoadState('networkidle');

        await use(page);
        await context.close();
    },

    createOrder: async ({ request }, use) => {
        const apiUtils = new APIUtils(request, loginPayload);
        const response = await apiUtils.createOrder(orderPayload);
        await use(response);
    }
});