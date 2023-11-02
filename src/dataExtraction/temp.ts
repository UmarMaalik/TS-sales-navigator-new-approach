import { Page,CDPSession } from "puppeteer";
import { randomTimeout } from "../Timeout/Timeout";
import { ElementHandle } from 'puppeteer';
import { ProfileData } from "../models/ProfileData";
import path from "path";
export async function temp(page: Page) {
  console.log("start of the function");
  
  const data:any[]=[];
  try{
  await page.waitForSelector(".artdeco-list__item", { timeout: 10000 });
  }
  catch(err){
    console.log("the lsit not found");
    await page.screenshot({ path:'src/screenshots/listnotfound.png' });
    return null;
    
  }
  try {
    await page.waitForSelector(".artdeco-entity-lockup__subtitle", {
      timeout: 50000,
    });
  } catch (error) {
    await page.screenshot({ path:'src/screenshots/subtitlenotfound.png' });
    console.log("Cannot find .artdeco-entity-lockup__subtitle");
  }

  await randomTimeout(1, 4);
console.log("going to scroll down");

  // Scroll down to load more profiles
  await scrollDown(page);

  // Get all containers
  try{
    console.log("searching for all containers");
    
  const containers = await page.$$(".artdeco-list__item");

  console.log("Total containers:", containers.length);
 
let count=0
let current =" "
  // Iterate over containers
  console.log("going to enter for loop");
  
  for (const container of containers) {
console.log("in for loop");

    const scrollOffset = 10; // Adjust this value as needed
console.log("before evaluate method");

// Scroll the container to the calculated position
await container.evaluate((el, offset) => {
  el.scrollIntoView({ behavior: 'auto', block: 'center' });
  el.scrollTop += offset;
}, scrollOffset);

   
    // Find anchor tag within the container
    console.log("finding anchor tag");
    
    const anchor = await container.$(".artdeco-entity-lockup__subtitle a");
    await randomTimeout(1,2)
    let newname=await container.$(".artdeco-entity-lockup__title");
    let tempname: string | null = await newname?.evaluate((node) => (node as HTMLElement)?.innerText?.trim()) || null;
    if (anchor) {
      try {
       console.log("in try of hovering");
       
        
        // Hover over the anchor (you may need to wait for a tooltip or popup)
        await anchor.hover();
        await randomTimeout(3,6)
       await page.waitForSelector(".entity-hovercard__title-container a",{ timeout: 10000 })
        let anchor1 = await page.$(".entity-hovercard__title-container a");
        console.log("the anchor1 is",anchor1);
      
        
        let noon = await anchor1?.evaluate((node) => node.innerText.trim());
        console.log("Hovered over anchor successfully.", noon);
        console.log("the person name is ", tempname);
        console.log("the value of current is:++++++++++++++>",current);
        var  Retry=0;
        while(noon==current)
        {
          if(Retry==3)
          {
            return;
          }
          
          console.log("in while");
          
          await anchor.hover();
          anchor1 = await page.$(".entity-hovercard__title-container a");
          noon = await anchor1?.evaluate((node) => node.innerText.trim());
          Retry++;
        }
      
      
        if(noon&&noon!==null)
        {
       
            data.push({
              name: tempname,
              Companyname: noon,
            });
            count++;
            current=noon;
      
        }

        
      } catch (error) {
        console.error("Error hovering over the element:", error);
        
        await page.screenshot({ path:'src/screenshots/hovering.png' });
        // Implement retry logic or other actions to make the element hoverable.
      }
    } else {
      console.log("Anchor element not found in the container.");
    }
    await randomTimeout(4,6)
    console.log("before bounding box");
    
    const boundingBox = await anchor?.boundingBox();
        if (boundingBox) {
          await page.mouse.move(boundingBox.x - 10, boundingBox.y - 10); // Move slightly away from the element
        }
        await randomTimeout(2,5)
  }
  console.log("the value of count is ", count);
  return data;
}
catch(err)
{
  console.log("error on the page",err);
  await page.screenshot({ path:'src/screenshots/templastCatch.png' });
  
}
}

async function scrollDown(page: Page) {
  const scrollIncrement: number = 150;
  let currentScroll: number = 0;

  const containerHeight: number = await page.$eval(
    "#search-results-container",
    (element) => element.scrollHeight
  );

  while (currentScroll < containerHeight) {
    await page.$eval(
      "#search-results-container",
      (element, scrollIncrement) => {
        element.scrollTo(0, element.scrollTop + scrollIncrement);
      },
      scrollIncrement
    );

    await randomTimeout(2, 6);

    const newScroll: number = await page.$eval(
      "#search-results-container",
      (element) => element.scrollTop
    );

    if (newScroll === currentScroll) {
      break;
    }

    currentScroll = newScroll;
  }
}

