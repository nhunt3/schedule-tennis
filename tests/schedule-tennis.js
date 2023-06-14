const playwright = require('@playwright/test');
const { SSM, config } = require('aws-sdk');
const { setTimeRange } = require('./util');
config.update({region:'us-east-1'});

async function book(options) {
  const { dayOfWeek, startTime, numberOf30MinSlots, courtNumber} = options;
  const ssm = new SSM();
  const result = await ssm
      .getParameter({ Name: 'my-oldest-password', WithDecryption: true })
      .promise();
  const password = result.Parameter.Value;

  const browser = await playwright.chromium.launch({
    headless: true // setting this to true will not run the UI
  });

  const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36";
  const page = await browser.newPage({ userAgent });
  await page.goto('https://app.playbypoint.com');

  if (await page.locator("[id='user_email']").count() > 0) {
    await page.locator("[id='user_email']").fill('nhunt11@gmail.com');
    await page.locator("[id='user_password']").fill(password);
    await page.locator("[name='commit']").click();
  }

  await page.getByRole('button', { name: "Sharon E. Lester at Piedmont Park" }).click();
  await page.locator('a[value="Sharon E. Lester at Piedmont Park"]').isVisible();
  await page.getByText("Book Now").click();
  // await page.getByText(dayOfWeek, {exact: true }).click();
  //
  // const timeSlots = setTimeRange(startTime, numberOf30MinSlots);
  // for (timeSlot of timeSlots) {
  //   await page.getByText(timeSlot).click();
  // }
  //
  // await page.getByText("Court " + courtNumber).click();
  // await page.getByRole('button', { name: "Next" }).click();
  // await page.getByRole('button', { name: "Add Users" }).click();
  // await page.getByRole('button', { name: "Add", exact: true }).click();
  // await page.getByRole('button', { name: "Next" }).click();


  // await page.waitForTimeout(5000); // wait for 5 seconds
  await browser.close();
}

book({
  dayOfWeek: 'Fri',
  startTime: '9',
  numberOf30MinSlots: 3,
  courtNumber: '4'
});
