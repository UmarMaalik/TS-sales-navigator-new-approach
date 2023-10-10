import { Page } from "puppeteer";

export async function GoogleSearch(page: Page, updatedCompanyName: string, currenturl: string): Promise<string | undefined> {
  try {
    await page.type('textarea[name="q"]', `${updatedCompanyName} ${"linkedin"}`);
    await page.keyboard.press('Enter');
    await page.waitForNavigation();
    await page.waitForSelector(`a[jsname="UWckNb"]`);
    const anchorTags = await page.$$(`a[jsname="UWckNb"]`);
    console.log("the anchor tags", anchorTags);
    for (let anchor of anchorTags) {
      console.log("the company name is", updatedCompanyName);
      const hrefProperty = await anchor.getProperty('href');
      const href = await hrefProperty.jsonValue();
      const h3Text = await anchor.$eval('h3', (element) => {
        return element.textContent;
      });

      console.log('Company Name:', h3Text);
      // Log the "href" value
      console.log('href:', href);
      if (h3Text === updatedCompanyName) {
        currenturl = href;
        return currenturl;
      }
    }
    
    // If the loop doesn't find a match, return undefined
    return undefined;
    
  } catch (error) {
    console.error('this is googleSearch:Error in GoogleSearch:', error);
    // You can handle the error here, such as logging it or throwing a custom error.
    // Example: throw new Error('Failed to perform Google search');
    // If an error occurs, do not return currenturl here.
  }
  return undefined;
}
