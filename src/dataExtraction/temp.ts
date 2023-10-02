import { Page } from "puppeteer";
import { randomTimeout } from "../Timeout/Timeout";
import { ElementHandle } from 'puppeteer';
import { ProfileData } from "../models/ProfileData";

export async function temp(page: Page) {
  await page.waitForSelector(".artdeco-list__item", { timeout: 10000 });

  try {
    await page.waitForSelector(".artdeco-entity-lockup__subtitle", {
      timeout: 20000,
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

  // Iterate over containers
  for (const container of containers) {
    // Find anchor tag within the container
    const anchor = await container.$(".artdeco-entity-lockup__subtitle a");

    if (anchor) {
      try {
        // Hover over the anchor (you may need to wait for a tooltip or popup)
        await anchor.hover();
        await randomTimeout(3,6)
        const anchor1 = await page.$(".entity-hovercard__title-container a");
        console.log("the anchor1 is",anchor1);
        
        let noon = await anchor1?.evaluate((node) => node.innerText);
        console.log("Hovered over anchor successfully.", noon);
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
  }
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
