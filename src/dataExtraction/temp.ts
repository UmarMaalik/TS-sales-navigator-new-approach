import { Page } from "puppeteer";
import { randomTimeout } from "../Timeout/Timeout";
import { ElementHandle } from 'puppeteer';
import { ProfileData } from "../models/ProfileData";

export async function temp(page: Page) {
  const data:any[]=[];
  await page.waitForSelector(".artdeco-list__item", { timeout: 10000 });

  try {
    await page.waitForSelector(".artdeco-entity-lockup__subtitle", {
      timeout: 50000,
    });
  } catch (error) {
    console.log("Cannot find .artdeco-entity-lockup__subtitle");
  }

  await randomTimeout(1, 4);

  // Scroll down to load more profiles
  await scrollDown(page);

  // Get all containers
  const containers = await page.$$(".artdeco-list__item");

  console.log("Total containers:", containers.length);
let count=0
  // Iterate over containers
  for (const container of containers) {

    // const box = await container.boundingBox();
    // if(box)
    // {
    //   const scrollX = box.x + box.width / 2;
    //   const scrollY = box.y + box.height / 2;
    //   await page.evaluate((scrollX, scrollY) => {
    //     window.scrollTo(scrollX, scrollY);
    //   }, scrollX, scrollY);
    // }
    await container.evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'start' }));
    await randomTimeout(2,5)
    // Find anchor tag within the container
    const anchor = await container.$(".artdeco-entity-lockup__subtitle a");
    await randomTimeout(1,2)
    let newname=await container.$(".artdeco-entity-lockup__title");
    let tempname: string | null = await newname?.evaluate((node) => (node as HTMLElement)?.innerText?.trim()) || null;
    if (anchor) {
      try {
       
        
        // Hover over the anchor (you may need to wait for a tooltip or popup)
        await anchor.hover();
        await randomTimeout(3,6)
        const anchor1 = await page.$(".entity-hovercard__title-container a");
        console.log("the anchor1 is",anchor1);
        
        let noon = await anchor1?.evaluate((node) => node.innerText.trim());
        console.log("Hovered over anchor successfully.", noon); 
        if(noon&&noon!==null)
        {
          // const isDuplicate = data.some((item) => item.name === tempname && item.Companyname === noon);
          // if (!isDuplicate) {
            data.push({
              name: tempname,
              Companyname: noon,
            });
            count++;
          // }
          // data.push({
          //   name:tempname,
          //   Companyname:noon
          // })
          // count++;
        }

        
      } catch (error) {
        console.error("Error hovering over the element:", error);
        // Implement retry logic or other actions to make the element hoverable.
      }
    } else {
      console.log("Anchor element not found in the container.");
    }
    await randomTimeout(4,6)
    const boundingBox = await anchor?.boundingBox();
        if (boundingBox) {
          await page.mouse.move(boundingBox.x - 10, boundingBox.y - 10); // Move slightly away from the element
        }
        await randomTimeout(2,5)
  }
  console.log("the value of count is ", count);
  return data;
}

async function scrollDown(page: Page) {
  const scrollIncrement: number = 100;
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
