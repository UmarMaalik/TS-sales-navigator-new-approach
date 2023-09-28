import { Page } from "puppeteer";
import { randomTimeout } from "../Timeout/Timeout";
export async function CompanyFilter(page:Page){
    const fieldsetTitle:string = "Company headquarters location";
      await page.evaluate((title:string) => {
        // Find the fieldset with the specified title attribute
        const fieldset: HTMLElement | null = document.querySelector(`fieldset[title="${title}"]`);

    
        // Check if the fieldset exists
        if (fieldset) {
          // Find the button within the fieldset
          const button:HTMLElement | null = fieldset.querySelector('button');
    
          // Check if the button exists
          if (button) {
            // Click the button
            button.click();
          }
        }
      }, fieldsetTitle);
      await randomTimeout(5,10)
  await page.type(".artdeco-typeahead__input.search-filter__focus-target--input", "North America");
  const title:string = "Include “North America” in Company headquarters location filter";

  // Use page.evaluate to click the button
  await page.evaluate((title:string) => {
    // Find the fieldset with the specified title attribute
    const Drop:HTMLElement | null  = document.querySelector(`li[aria-label="${title}"]`);

    // Check if the fieldset exists
    if (Drop) {
      // Find the button within the fieldset
      const button:HTMLElement | null  = Drop.querySelector(`button[title="Include “North America” in Company headquarters location filter"]`);

      // Check if the button exists
      if (button) {
        // Click the button
        button.click();
      }
    }
  }, title);
  await randomTimeout(5,10)
  await page.type(".artdeco-typeahead__input.search-filter__focus-target--input", "United States");
  await randomTimeout(4,7)
  const title1:string = "Include “United States” in Company headquarters location filter";

  // Use page.evaluate to click the button
  await page.evaluate((title1) => {
    console.log("in page evaluate");
    console.log("the value of title is",title1);
    // Find the fieldset with the specified title attribute
    const Drop = document.querySelector(`li[aria-label="${title1}"]`);
    console.log("the value of drop is:",Drop);

    // Check if the fieldset exists
    if (Drop) {
      console.log("in if Drop if");
      // Find the button within the fieldset
      const button:HTMLElement | null = Drop.querySelector(`button[title="Include “United States” in Company headquarters location filter"]`);

      // Check if the button exists
      if (button) {
        console.log("in button if");
        // Click the button
        button.click();
      }
    }
  }, title1);

}