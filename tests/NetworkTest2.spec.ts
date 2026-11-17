const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('./Utils/APIUtils');

const newAccount = { userEmail: "teste1@gmail.com", userPassword: "testE1234" };
const orderPayload = { orders: [{ country: "Brazil", productOrderedId: "6960eac0c941646b7a8b3e68" }] };

const myEmail = "natalycastilione@hotmail.com";
const myPassword = "Teste@1234";

let otherUserOrderId;

test.beforeAll(async () => {

    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, newAccount);
    const response = await apiUtils.createOrder(orderPayload);
    otherUserOrderId = response.orderId;
    console.log("Pedido da conta nova:", otherUserOrderId);
});

test('Security test - acessar pedido de outro usuario', async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(myEmail);
    await page.locator("#userPassword").fill(myPassword);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();

    
    await page.route(/get-orders-details/, route =>
        route.continue({
            url: `https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6afba72392a4341c4c1d6e01`
        }));

    const [resp] = await Promise.all([
        page.waitForResponse(r => r.url().includes("get-orders-details")),
        page.locator("button:has-text('View')").first().click(),
    ]);

    console.log(resp.status(), await resp.text());

    await expect(page.getByText("not authorize")).toBeVisible();
});