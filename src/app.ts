import puppeteer from "puppeteer-extra";
import { ProfileData } from "./models/ProfileData";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import pluginAnonymizeUA from "puppeteer-extra-plugin-anonymize-ua";
import { randomTimeout } from "./Timeout/Timeout";
import fs from "fs";
import { Page, ElementHandle } from "puppeteer";
import path from "path";
import { CompanyFilter } from "./filter/filter";
import { ExtractData } from "./dataExtraction/Extraction";

// (async () => {

puppeteer.use(pluginStealth());
puppeteer.use(pluginAnonymizeUA());
puppeteer
  .launch({
    headless: false,
    slowMo: 100,
    protocolTimeout: 70000,
    args: ["--no-sandbox"],
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  })
  .then(async (browser) => {
    const BaseUrl: string = "https://www.linkedin.com/sales/home";
    const page: Page = await browser.newPage();
    const JobTitle: string = "CEO";
    const Industy: string = "blockchain";
    const biglist: ProfileData[] = [];
    await randomTimeout(5, 9);
    try {
      const cookiesFilePath: string = path.join(
        __dirname,
        "Cookies/cookies.json"
      );

      const cookiesData: string = fs.readFileSync(cookiesFilePath, "utf-8");
      const cookies = JSON.parse(cookiesData);
      await page.setCookie(...cookies);
      await randomTimeout(5, 9);
      // Now, 'cookies' contains the data from the JSON file, and you can use it in your code.
    } catch (error) {
      console.error("Error reading or parsing the JSON file:", error);
    }

    await page.goto(`${BaseUrl}`, { waitUntil: "load" });
    await randomTimeout(5, 10);
    await page.goto(
      "https://www.linkedin.com/sales/search/people?viewAllFilters=true",
      { waitUntil: "load" }
    );
    await randomTimeout(5, 10);
    await CompanyFilter(page);
    await randomTimeout(5, 7);
    await page.type("#global-typeahead-search-input", `${JobTitle} ${Industy}`);
    await page.keyboard.press("Enter");
    await randomTimeout(5, 12);
    for (let i = 0; i < 5; i++) {
      const tempvalue: ProfileData[] = await ExtractData(page);
      console.log("the temp value is", tempvalue);
      for (let entry of tempvalue) {
        biglist.push(entry);
      }
      await page.waitForSelector(
        ".artdeco-pagination__button.artdeco-pagination__button--next",
        { timeout: 10000 }
      );
      await page.click(
        ".artdeco-pagination__button.artdeco-pagination__button--next"
      );
    }
    console.log("the big list is", biglist);
    const jsonData = JSON.stringify(biglist, null, 2);
    const FoutputPath: string = path.join(__dirname, "output/extracted.json");
    console.log("json data", jsonData);

    fs.writeFile(FoutputPath, jsonData, { encoding: "utf-8" }, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log(`Data saved to ${FoutputPath}`);
      }
    });
  });
// })
