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
import { temp } from "./dataExtraction/temp";
import { OtherInfoExtraction } from "./googleExtraction/OtherInfoExtraction";
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
    const NewList: ProfileData[]|undefined = [];
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
    const aviarry:any[]=[];
    for (let i = 0; i < 3; i++) {
       let non=await temp(page);
      // console.log("the temp value is", tempvalue);
      for (let entry of non) {
        aviarry.push(entry);
      }
      await page.waitForSelector(
        ".artdeco-pagination__button.artdeco-pagination__button--next",
        { timeout: 10000 }
      );
      await page.click(
        ".artdeco-pagination__button.artdeco-pagination__button--next"
      );
    }
    console.log("the big list is", aviarry);
    const jsonData = JSON.stringify(aviarry, null, 2);
    const FoutputPath: string = path.join(__dirname, "output/extracted.json");
    console.log("json data", jsonData);

    fs.writeFile(FoutputPath, jsonData, { encoding: "utf-8" }, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log(`Data saved to ${FoutputPath}`);
      }
    });
    // fs.readFile(FoutputPath, 'utf8', (err, data) => {
    //   if (err) {
    //     console.error('Error reading the file:', err);
    //     return;
    //   }
    
    //   try {
    //     // Parse the JSON data into an object or array
    //     const jsonData = JSON.parse(data);
    
    //     // Now you can work with the JSON data
    //     console.log('JSON data:', jsonData);
    
    //     // You can iterate through the records in the JSON data
    //     for (const record of jsonData) {
    //       // Do something with each record
       
            
        
    //     }
    //   } catch (parseError) {
    //     console.error('Error parsing JSON:', parseError);
    //   }
    // }) 
//   let data;

// try {
//   const dataBuffer = fs.readFileSync(FoutputPath);
//   const jsonData = JSON.parse(dataBuffer.toString());
// // console.log("json data",jsonData);
//   // Access the data object from the JSON file
//    data = jsonData;

//   // Now you have your data in the "data" variable as an array of objects
//   // console.log(data);
// } catch (error) {
//   console.error('Error reading the JSON file:', error);
// }
// console.log("the new data",data);
// for(let entry of data) {
//   const x=await OtherInfoExtraction(browser,entry);
//   if(x)
//   {
//     NewList.push(x)
//   }

// //   console.log("app.ts data",x);
// }
// console.log("the new biglist is",NewList);

// // for(let i=0;i<1;i++)
// // {
// //   const x=await OtherInfoExtraction(browser,data[i]);
// //   console.log("app.ts data",x);
  
// // }

 
  });
// })
