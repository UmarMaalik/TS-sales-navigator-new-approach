import puppeteer from "puppeteer-extra";
import { ProfileData } from "./models/ProfileData";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import pluginAnonymizeUA from "puppeteer-extra-plugin-anonymize-ua";
import { randomTimeout } from "./Timeout/Timeout";

import fs from "fs";
import {Cluster} from "puppeteer-cluster";
import  {Page, ElementHandle } from "puppeteer";
import path from "path";
import { CompanyFilter } from "./filter/filter";
import { ExtractData } from "./dataExtraction/Extraction";
import { temp } from "./dataExtraction/temp";
import { OtherInfoExtraction } from "./googleExtraction/OtherInfoExtraction";
import { GoogleData } from "./models/googleData";
import { Browser } from "puppeteer";


puppeteer.use(pluginStealth());
puppeteer.use(pluginAnonymizeUA());
const run=async () => {
  const maxBrowsers = 3;
  const browsers: Browser[] = [];

  for (let i = 0; i < maxBrowsers; i++) {
    const browser = await puppeteer.launch({
      headless:'new',
      slowMo: 100,
      protocolTimeout: 70000,
      args: ["--no-sandbox"],
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    });
    browsers.push(browser);
  }
puppeteer
  .launch({
    headless:false,
    slowMo: 100,
    protocolTimeout: 70000,
    args: ["--no-sandbox"],
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  })
  // .then(async (browser) => {
    const BaseUrl: string = "https://www.linkedin.com/sales/home";
    const page: Page = await browsers[0].newPage();
    const JobTitle: string = "CEO";
    const Industy: string = "blockchain";
    const biglist: ProfileData[] = [];
    const NewList: GoogleData[]|undefined = [];
    // await randomTimeout(5, 9);
    // try {
    //   const cookiesFilePath: string = path.join(
    //     __dirname,
    //     "Cookies/cookies.json"
    //   );

    //   const cookiesData: string = fs.readFileSync(cookiesFilePath, "utf-8");
    //   const cookies = JSON.parse(cookiesData);
    //   await page.setCookie(...cookies);
    //   await randomTimeout(5, 9);
    //   // Now, 'cookies' contains the data from the JSON file, and you can use it in your code.
    // } catch (error) {
    //   console.error("Error reading or parsing the JSON file:", error);
    // }

    // await page.goto(`${BaseUrl}`, { waitUntil: "load" });
    // await randomTimeout(5, 10);
    // await page.goto(
    //   "https://www.linkedin.com/sales/search/people?viewAllFilters=true",
    //   { waitUntil: "load" }
    // );
    // await randomTimeout(5, 10);
    // await CompanyFilter(page);
    // await randomTimeout(5, 7);
    // await page.type("#global-typeahead-search-input", `${JobTitle} ${Industy}`);
    // await page.keyboard.press("Enter");
    // await randomTimeout(5, 12);
    // const aviarry:any[]=[];
    // let pa:number=1;
    // for (let i = 0; i < 30; i++) {
    //   console.log("the current page is=>>>>>>>>>>>>>>>>>>>>> ",pa);
      
    //    let non=await temp(page);
    //   // console.log("the temp value is", tempvalue);
    //   for (let entry of non) {
    //     aviarry.push(entry);
    //   }
    //   try{
    //   await page.waitForSelector(
    //     ".artdeco-pagination__button.artdeco-pagination__button--next",
    //     { timeout: 10000 }
    //   );
    //   await page.click(
    //     ".artdeco-pagination__button.artdeco-pagination__button--next"
    //   );
    //   pa++;
    //   }
    //   catch(err)
    //   {
    //     console.log("cannot proceed to the next page",err);
        
    //   }
    // }
    // console.log("number of pages visited:====",pa);
    
    // console.log("the big list is", aviarry);
    // const jsonData = JSON.stringify(aviarry, null, 2);
    const FoutputPath: string = path.join(__dirname, "output/extracted.json");
    // console.log("json data", jsonData);

    // fs.writeFile(FoutputPath, jsonData, { encoding: "utf-8" }, (err) => {
    //   if (err) {
    //     console.error("Error writing file:", err);
    //   } else {
    //     console.log(`Data saved to ${FoutputPath}`);
    //   }
    // });
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
  let data;

try {
  const dataBuffer = fs.readFileSync(FoutputPath);
  const jsonData = JSON.parse(dataBuffer.toString());
// console.log("json data",jsonData);
  // Access the data object from the JSON file
   data = jsonData;

  // Now you have your data in the "data" variable as an array of objects
  // console.log(data);
} catch (error) {
  console.error('Error reading the JSON file:', error);
}
console.log("the new data",data);
const clusterPromises = [];
let browserCounter = 0;
  // Create a new instance of Cluster
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 3, // Set the maximum concurrency here
  
  });

  await cluster.task(async ({ page, data }) => {
    try {
      const browser = browsers[browserCounter]; // Get the browser based on the counter
      browserCounter = (browserCounter + 1) % maxBrowsers; // Increment the counter, loop back if needed

      const x = await OtherInfoExtraction(browser, data);

      if (x) {
        NewList.push(x);
      }

      console.log("app.ts data", x);
    } catch (error) {
      console.error("An error occurred while processing:", error);
    }
  });

  // Rest of your code



  // Queue all entries for parallel processing
  for (const entry of data) {
    // clusterPromises.push(cluster.queue(entry));
    cluster.queue(entry); 
   }

  // Wait for all tasks to finish
  // await Promise.all(clusterPromises);
  // for (const browser of browsers) {
  //   try{
  //     await randomTimeout(4,7)
  //     await browser.close();
  //   }catch(err)
  //   {
  //     console.log("error while closing browser", err);
      
  //   }
   
  // }
  await cluster.idle();
  await cluster.close();



  console.log("the new list is",NewList);
  const jsonData = JSON.stringify(NewList, null, 2);

// Define the output file path
const outputFilePath = path.join(__dirname, "output/newList.json");

// Write the JSON data to the file
fs.writeFile(outputFilePath, jsonData, "utf-8", (err) => {
  if (err) {
    console.error("Error writing file:", err);
  } else {
    console.log(`Data saved to ${outputFilePath}`);
  }
});
// for(let entry of data) {
//   const x=await OtherInfoExtraction(browser,entry);
//   if(x)
//   {
//     NewList.push(x)
//   }

//   console.log("app.ts data",x);
// }
// console.log("the new biglist is",NewList);



 
  };
  run();
// })
