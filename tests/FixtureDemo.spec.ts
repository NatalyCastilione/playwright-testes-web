const { expect } = require('@playwright/test');
const { customtest } = require('./Utils/Fixture');

customtest("Fixture test", async ({ authenticatePage, createOrder }) => {

    await authenticatePage.locator("button[routerlink*='myorders']").click();
    await authenticatePage.locator("tbody").waitFor();
    await expect(authenticatePage.getByText(createOrder.orderId)).toBeVisible();

});