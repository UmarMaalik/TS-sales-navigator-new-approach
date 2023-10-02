import { Browser, Page } from "puppeteer";
import { randomTimeout } from "../Timeout/Timeout";
import {ElementHandle} from 'puppeteer'
import { ProfileData } from "../models/ProfileData";

export async function OtherInfoExtraction(browser:Browser,entry:ProfileData){
    let currenturl:String =" ";
    const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
 await page.goto("https://www.google.com/", {
    waitUntil: 'load', 
    timeout: 30000, 
  })
  await page.click('textarea[name="q"]')
  await page.type('textarea[name="q"]',`${entry.designiation} ${"linkedin"}`)
  await page.keyboard.press('Enter');
  await page.waitForNavigation()
  await page.waitForSelector(`a[jsname="UWckNb"]`)
  const anchorTags = await page.$$(`a[jsname="UWckNb"]`);
  console.log("the anchor tags",anchorTags);
  for(let anchor of anchorTags)
  {
    console.log("the company name is",entry.designiation)
    const hrefProperty = await anchor.getProperty('href');
    const href = await hrefProperty.jsonValue();
    const h3Text = await anchor.$eval('h3', (element) => {
        return element.textContent;
      });
    
      console.log('Company Name:', h3Text);
    // Log the "href" value
    console.log('href:', href);
    if(h3Text===entry.designiation)
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
        const profiles = await page.evaluate((entry) => {
            let Data:ProfileData;
            const div:HTMLElement|null = document.querySelector('div[data-test-id="about-us__website"]>dd>a');
            const website=div?.innerText
            if(website)
            {
                return Data={
                    fullname:entry.fullname,
            firstName:" ",
            secondName:" ",
            designiation:entry.designiation,
            CompanyLinkedinLink: entry.CompanyLinkedinLink,
            website:website,
            domain:""
                }
            }
            
            
        },entry)
        await randomTimeout(3,5);
        await page.close();
        return profiles;
      }catch(err)
      {
        console.log("the error has occured");
        try{
            const profiles = await page.evaluate((entry) => {
                let Data:ProfileData;
                const div:HTMLElement|null = document.querySelector('div[data-test-id="about-us__website"]>dd>a');
                const website=div?.innerText
                if(website)
                {
                    return Data={
                        fullname:entry.fullname,
                firstName:" ",
                secondName:" ",
                designiation:entry.designiation,
                CompanyLinkedinLink: entry.CompanyLinkedinLink,
                website:website,
                domain:""
                    }
                }
                
                
            },entry)
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

    
}