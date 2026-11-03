const { test, expect, request } = require('@playwright/test');

const loginPayload = {userEmail: "natalycastilione@hotmail.com", userPassword: "Teste@1234" };
let token;

    test.beforeAll(async () => {
        const apiContext = await request.newContext();
        const loginResponse = await apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
            data: loginPayload
         })
         expect(loginResponse.ok()).toBeTruthy();
         const loginResponseJson = await loginResponse.json();
         token = loginResponseJson.token;
         console.log(token);
        
    
    });


    test.beforeEach(async () => {


    
    });



test.only('Place the order', async ({ page }) => {

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);

    }, token);
    const email = "natalycastilione@hotmail.com";
    const productName = 'ZARA COAT 3';
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);

    const count = await products.count();
    for (let i = 0; i < count; ++i) {
        const name = await products.nth(i).locator("b").textContent();
        if (name.trim().toLowerCase() === productName.toLowerCase()) {
            await products.nth(i).locator("text=Add To Cart").click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(bool).toBeTruthy();
    await page.locator("text=Checkout").click();
    await page.locator("input[type='text']").nth(0).fill("4542 9931 9292 2293");
    const selects = page.locator("select.input.ddl");
    await selects.first().selectOption("05");
    await selects.nth(1).selectOption("25");
    await page.locator("input[type='text']").nth(1).fill("123");
    await page.locator("input[type='text']").nth(2).fill("Nataly Castilione");
    await page.locator("[name='coupon']").fill("rahulshettyacademy");
    await page.locator("button:has-text('Apply Coupon')").click();

    const country = page.locator("[placeholder*='Country']");
    await country.click();
    await country.pressSequentially("bra", { delay: 150 });
    const dropdwon = page.locator(".ta-results");
    await dropdwon.waitFor();
    const optionsCount = await dropdwon.locator("button").count();
    for (let i = 0; i < optionsCount; ++i) {
           const text = await dropdwon.locator("button").nth(i).textContent();
           if (text.trim() === "Brazil") {
                await dropdwon.locator("button").nth(i).click();
                break;
            }
        }
            await expect(page.getByText(email).first()).toBeVisible();
            await page.locator(".action__submit").click();
            await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
            const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
            console.log(orderId);

            await page.locator("button[routerlink*='myorders']").click();
            await page.locator("tbody").waitFor();
            const rows = page.locator("tbody tr");
 
 
            for (let i = 0; i < await rows.count(); ++i) {
                const rowOrderId = await rows.nth(i).locator("th").textContent();
                if (orderId.includes(rowOrderId)) {
                    await rows.nth(i).locator("button").first().click();
                    break;
      }
   }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
 
});