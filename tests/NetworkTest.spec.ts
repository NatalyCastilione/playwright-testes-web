const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('./Utils/APIUtils');

const loginPayload = { userEmail: "natalycastilione@hotmail.com", userPassword: "Teste@1234" };
const orderPayload = { orders: [{ country: "Brazil", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
const fakePayLoadOders = { data: [], message: "No Orders" };
let response;

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
});

test('Place the order', async ({ page }) => {

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);
    await page.goto("https://rahulshettyacademy.com/client");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6adc195aa90a419aa82559c3",
    async route => {
       const response = await page.request.fetch(route.request());
       let body = JSON.stringify(fakePayLoadOders);
       route.fulfill({
        
        response,
        body,

        })
    });
    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6adc195aa90a419aa82559c3");
    console.log(await page.locator(".mt-4").textContent());
});