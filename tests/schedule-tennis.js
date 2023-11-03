const playwright = require('@playwright/test');
const { SSM, config } = require('aws-sdk');
const { setTimeRange, getBookNowHeader, getFacilityNameOnButton } = require('./util.js');
config.update({region:'us-east-1'});

 exports.book = async (options) => {
     try {
         const {
             date,
             startTime,
             numberOf30MinSlots,
             courtNumber,
             facility,
             courtSurface,
             guestName
         } = options;
         const ssm = new SSM();
         const result = await ssm
             .getParameter({Name: 'my-oldest-password', WithDecryption: true})
             .promise();
         const password = result.Parameter.Value;
         const browser = await playwright.chromium.launch({
             headless: true // setting this to true will not run the UI
         });
         const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36";
         const page = await browser.newPage({userAgent});
         await page.goto('https://app.playbypoint.com');

         if (await page.locator("[id='user_email']").count() > 0) {
             await page.locator("[id='user_email']").fill('nhunt11@gmail.com');
             await page.locator("[id='user_password']").fill(password);
             await page.locator("[name='commit']").click();
         }

         await page.getByRole('button', {name: getFacilityNameOnButton(facility)}).click();
         const bookNowHeader = getBookNowHeader(facility);
         await page.locator(`a[href="/f/${bookNowHeader}"]`).waitFor({state: "visible"});
         await page.getByText("Book Now").click();
         await page.getByText(date, {exact: true}).click();

         if (courtSurface) {
             await page.getByRole('button', {name: courtSurface}).click();
         }

         const timeSlots = setTimeRange(startTime, numberOf30MinSlots);
         for (timeSlot of timeSlots) {
             await page.getByText(timeSlot).click();
         }

         if (courtNumber) {
             await page.getByText("Court " + courtNumber).click();
         }

         await page.getByRole('button', {name: "Next"}).click();
         await page.getByRole('button', {name: "Add Users"}).click();
         await page.getByRole('button', {name: "Add", exact: true}).click();

         if (facility === 'Sandy Springs') {
             await page.locator(`i[class*="icon-pencil2"]`).click();
             await page.locator("input[value*='Guest']").fill(guestName);
             await page.getByRole('button', {name: "Save"}).click();
         }

         await page.getByRole('button', {name: "Next"}).click();
         await page.getByRole('button', { name: "Book" }).click();

         // await page.waitForTimeout(5000); // wait for 5 seconds
         await browser.close();
     }
     catch (err) {
         console.error('nick - error - ', err);
     }
}
