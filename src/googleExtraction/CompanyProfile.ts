
import { Page } from "puppeteer";
import { randomTimeout } from "../Timeout/Timeout";
import { GoogleData } from "../models/googleData";
import { ProfileData } from "../models/ProfileData";

export async function Companyprofile(
  page: Page,
  currenturl: string,
  updatedCompanyName: string,
  entry: ProfileData
): Promise<GoogleData | Error> {
  try {
    await page.goto(`${currenturl}`, {
      waitUntil: "load",
      timeout: 30000,
    });
    await randomTimeout(2, 5);

    // Click the sign-in modal if it appears (optional)
    await page.click(
      `button[data-tracking-control-name="organization_guest_contextual-sign-in-modal_modal_dismiss"]`
    );
    await randomTimeout(5, 7);
    const profiles = await page.evaluate(
      (entry, updatedCompanyName) => {
        const div: HTMLElement | null = document.querySelector(
          'div[data-test-id="about-us__website"]>dd>a'
        );
        const divIndustry: HTMLElement | null = document.querySelector(
          'div[data-test-id="about-us__industry"]>dd'
        );
        const divCompSize: HTMLElement | null = document.querySelector(
          'div[data-test-id="about-us__size"]>dd'
        );
        const divHeadquaters: HTMLElement | null = document.querySelector(
          'div[data-test-id="about-us__headquarters"]>dd'
        );
        const divType: HTMLElement | null = document.querySelector(
          'div[data-test-id="about-us__organizationType"]>dd'
        );
        const divFounded: HTMLElement | null = document.querySelector(
          'div[data-test-id="about-us__foundedOn"]>dd'
        );

        const website = div?.innerText;
        const Industry = divIndustry?.innerText;
        const CompanySize = divCompSize?.innerText;
        const Headquaters = divHeadquaters?.innerText;
        const Type = divType?.innerText;
        const Founded = divFounded?.innerText;


        

        
          return {
            name: entry.name,
            Companyname: updatedCompanyName,
            website: website?website:"Website not Found",
            Industry: Industry?Industry:"Industry not Found",
            CompanySize: CompanySize?CompanySize:"Company size not found",
            Headquater: Headquaters?Headquaters:"Headquater location not found",
            Type: Type?Type:"Type not found",
            Founded: Founded?Founded:"When Founded not found",
          } as GoogleData;
      
      },
      entry,
      updatedCompanyName
    );

    await randomTimeout(3, 5);
console.log("the masla is ",profiles)
    return profiles;
  } catch (err) {
    console.error("An error occurred:", err);
    return err as Error;
  }
}
