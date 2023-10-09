import { Browser, Page } from "puppeteer";
import { randomTimeout } from "../Timeout/Timeout";
import {ElementHandle} from 'puppeteer'
import { ProfileData } from "../models/ProfileData";
import { GoogleData } from "../models/googleData";
export async function OtherInfoExtraction(browser:Browser,entry:ProfileData){
  try{
    let currenturl:String =" ";
    const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
 await page.goto("https://www.google.com/", {
    waitUntil: 'load', 
    timeout: 30000, 
  })
  await page.click('textarea[name="q"]')
  const emojiRegex:RegExp = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]|[\u2300-\u23FF]|[\u2B50]|[\u203C-\u3299\u00A9\u00AE]\uFE0F?/g;
  let updatedCompanyName =entry.Companyname.replace(emojiRegex,'').trim();
console.log("the company name before removing emojis:",entry.Companyname);
console.log("the company name after removing emojis:",updatedCompanyName);
console.log("the person name is:",entry.name);




  await page.type('textarea[name="q"]',`${updatedCompanyName} ${"linkedin"}`)
  await page.keyboard.press('Enter');
  await page.waitForNavigation()
  await page.waitForSelector(`a[jsname="UWckNb"]`)
  const anchorTags = await page.$$(`a[jsname="UWckNb"]`);
  console.log("the anchor tags",anchorTags);
  for(let anchor of anchorTags)
  {
    console.log("the company name is",updatedCompanyName)
    const hrefProperty = await anchor.getProperty('href');
    const href = await hrefProperty.jsonValue();
    const h3Text = await anchor.$eval('h3', (element) => {
        return element.textContent;
      });
    
      console.log('Company Name:', h3Text);
    // Log the "href" value
    console.log('href:', href);
    if(h3Text===updatedCompanyName)
    {
        currenturl=href
        break;
        
    }
    
  }
  if(currenturl &&currenturl!==" ")
  {
    await page.goto(`${currenturl}`,{
        waitUntil: 'load', 
        timeout: 30000, 
      })
      await randomTimeout(2,5)
      try{
        await page.click(`button[data-tracking-control-name="organization_guest_contextual-sign-in-modal_modal_dismiss"]`)
        const profiles = await page.evaluate((entry,updatedCompanyName) => {
            let Data:GoogleData;
            const div:HTMLElement|null = document.querySelector('div[data-test-id="about-us__website"]>dd>a');
            const website=div?.innerText
            if(website)
            {
                return Data={
                    name:entry.name,
                    Companyname:updatedCompanyName,
                   website:website,
           
                }
            }
            
            
        },entry,updatedCompanyName)
        await randomTimeout(3,5);
        await page.close();
        return profiles;
      }catch(err)
      {
        console.log("the error has occured");
        try{
            const profiles = await page.evaluate((entry,updatedCompanyName) => {
                let Data:GoogleData;
                const div:HTMLElement|null = document.querySelector('div[data-test-id="about-us__website"]>dd>a');
                const website=div?.innerText
                if(website)
                {
                    return Data={
                        name:entry.name,
                      Companyname:updatedCompanyName,
                website:website,
        
                    }
                }
                
                
            },entry,updatedCompanyName)
            await randomTimeout(3,5);
            await page.close();
            return profiles
        }catch(err)
        {
            console.log("the error has occured",err);
            
        }
     
        
      }
    

  }
  
await page.close()
  }catch(err){
    console.log("the error has occured",err);
    
  }

    
}