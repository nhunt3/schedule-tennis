const playwright = require('@playwright/test');
const { SSM, config } = require('aws-sdk');
config.update({region:'us-east-1'});

async function main() {
  const ssm = new SSM();
  const result = await ssm
      .getParameter({ Name: 'my-oldest-password', WithDecryption: true })
      .promise();
  const password = result.Parameter.Value;

  const browser = await playwright.chromium.launch({
    headless: false // setting this to true will not run the UI
  });

  const page = await browser.newPage();
  await page.goto('https://app.playbypoint.com');

  if (await page.locator("[id='user_email']").count() > 0) {
    await page.locator("[id='user_email']").fill('nhunt11@gmail.com');
    await page.locator("[id='user_password']").fill(password);
    await page.locator("[name='commit']").click();
  }

  await page.getByRole('button', { name: /Piedmont Park/i }).click();
  await page.getByText("Book Now").click();
  await page.getByText("Tue").click();
  await page.getByText("4:30-5pm").click();
  await page.getByText("5-5:30pm").click();
  await page.getByText("5:30-6pm").click();
  await page.getByText("6-6:30pm").click();
  await page.getByText("Court 5").click();
  await page.getByRole('button', { name: "Next" }).click();
  await page.getByRole('button', { name: "Add Users" }).click();
  await page.getByRole('button', { name: "Add", exact: true }).click();
  await page.getByRole('button', { name: "Next" }).click();


  // await page.waitForTimeout(5000); // wait for 5 seconds
  // await browser.close();
}

main();
