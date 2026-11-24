const { test, expect } = require('@playwright/test');

test("Popup validations", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    await page.pause();
    page.on('dialog',dialog => dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
    const framePage = page.frameLocator("#courses-iframe");
    await framePage.locator("li a[href*='lifetime-access']:visible").click();
        const textCheck = await framePage.locator(".text h2").textContent();
        console.log(textCheck).split(" ")[1].trim();
        
});

test("Screenshot & Visual comparision", async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator('#displayed-text').screenshot({path: 'partialScreenshot.png' });
    await page.locator("#hide-textbox").click();
    await page.screenshot({path: 'screenshot.png' });
    await expect(page.locator("#displayed-text")).toBeHidden();


});

test.only('visual', async ({ page }) => {

    await page.goto("https://google.com/");
    expect(await page.screenshot()).toMatchSnapshot('landing.png');
});