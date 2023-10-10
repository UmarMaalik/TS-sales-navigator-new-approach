import { Browser, Page } from "puppeteer";
import { randomTimeout } from "../Timeout/Timeout";
import {ElementHandle} from 'puppeteer'
import { ProfileData } from "../models/ProfileData";

import { GoogleSearch } from "./GoogleSearch";
import { Companyprofile } from "./CompanyProfile";
import { profile } from "console";
import { GoogleData } from "../models/googleData";
export async function OtherInfoExtraction(browser:Browser,entry:ProfileData){
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  try{
    let currenturl:string|undefined =" ";
    
  
 await page.goto("https://www.google.com/", {
    waitUntil: 'load', 
    timeout: 30000, 
  })
  await page.click('textarea[name="q"]')
  const emojiRegex:RegExp = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]|[\u2300-\u23FF]|[\u2B50]|[\u203C-\u3299\u00A9\u00AE]\uFE0F?/g;
  let updatedCompanyName =entry.Companyname.replace(emojiRegex,'').trim();
console.log("OtherINfoExtra:the company name before removing emojis:",entry.Companyname);
console.log("OtherINfoExtra:the company name after removing emojis:",updatedCompanyName);
console.log("OtherINfoExtra:the person name is:",entry.name);

  currenturl= await GoogleSearch(page,updatedCompanyName,currenturl)
 
  if (currenturl && currenturl !== " ") {
    try {
      const profileOrError = await Companyprofile(
        page,
        currenturl,
        updatedCompanyName,
        entry
      );
  
      if (profileOrError instanceof Error) {
        console.error(`OtherINfoExtra:An error occurred for ${entry.name}:`, profileOrError);
      } else {
        return profileOrError;
      }
    } catch (err) {
      console.error(`OtherINfoExtra:An error occurred for ${entry.name}:`, err);
    }
  }
  
  

  }catch(err){
    console.log("OtherINfoExtra:the error has occured",err);
    
  }finally{
    console.log("OtherINfoExtra:In Finally and going to close the page");
    await page.close();
  }

    
}


  // await page.type('textarea[name="q"]',`${updatedCompanyName} ${"linkedin"}`)
  // await page.keyboard.press('Enter');
  // await page.waitForNavigation()
  // await page.waitForSelector(`a[jsname="UWckNb"]`)
  // const anchorTags = await page.$$(`a[jsname="UWckNb"]`);
  // console.log("the anchor tags",anchorTags);
  // for(let anchor of anchorTags)
  // {
  //   console.log("the company name is",updatedCompanyName)
  //   const hrefProperty = await anchor.getProperty('href');
  //   const href = await hrefProperty.jsonValue();
  //   const h3Text = await anchor.$eval('h3', (element) => {
  //       return element.textContent;
  //     });
    
  //     console.log('Company Name:', h3Text);
  //   // Log the "href" value
  //   console.log('href:', href);
  //   if(h3Text===updatedCompanyName)
  //   {
  //       currenturl=href
  //       break;
        
  //   }
    
  // }

 // if(currenturl &&currenturl!==" ")
  // {
    
  //   const Profile:GoogleData|undefined|Error=await Companyprofile(page,currenturl,updatedCompanyName,entry)
  //   if(profile)
  //   {
  //     return profile
  //   }
 

  // }