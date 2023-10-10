// import { Page } from "puppeteer";
// import { randomTimeout } from "../Timeout/Timeout";
// import { GoogleData } from "../models/googleData";
// import { ProfileData } from "../models/ProfileData";
// import { error } from "console";
// export async function Companyprofile(page:Page,currenturl:string,updatedCompanyName:string,entry:ProfileData){
//     await page.goto(`${currenturl}`,{
//         waitUntil: 'load', 
//         timeout: 30000, 
//       })
//       await randomTimeout(2,5)
//       try{
//         await page.click(`button[data-tracking-control-name="organization_guest_contextual-sign-in-modal_modal_dismiss"]`)
//         const profiles = await page.evaluate((entry,updatedCompanyName) => {
//             let Data:GoogleData;
//             const div:HTMLElement|null = document.querySelector('div[data-test-id="about-us__website"]>dd>a');
//             const website=div?.innerText
//             if(website)
//             {
//                 return Data={
//                     name:entry.name,
//                     Companyname:updatedCompanyName,
//                    website:website,
           
//                 }
//             }
            
            
//         },entry,updatedCompanyName)
//         await randomTimeout(3,5);
//         await page.close();
//         return profiles;
//       }catch(err)
//       {
//         console.log("the error has occured");
//         try{
//             const profiles = await page.evaluate((entry,updatedCompanyName) => {
//                 let Data:GoogleData;
//                 const div:HTMLElement|null = document.querySelector('div[data-test-id="about-us__website"]>dd>a');
//                 const website=div?.innerText
//                 if(website)
//                 {
//                     return Data={
//                         name:entry.name,
//                       Companyname:updatedCompanyName,
//                 website:website,
        
//                     }
//                 }
                
                
//             },entry,updatedCompanyName)
//             await randomTimeout(3,5);
//             await page.close();
//             return profiles
//         }catch(err)
//         {
//             console.log("the error has occured",err);
//             return err;
            
//         }
     
        
//       }

// }
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
      waitUntil: 'load',
      timeout: 30000,
    });
    await randomTimeout(2, 5);

    // Click the sign-in modal if it appears (optional)
    await page.click(
      `button[data-tracking-control-name="organization_guest_contextual-sign-in-modal_modal_dismiss"]`
    );

    const profiles = await page.evaluate(
      (entry, updatedCompanyName) => {
        const div: HTMLElement | null = document.querySelector(
          'div[data-test-id="about-us__website"]>dd>a'
        );
        const website = div?.innerText;
        if (website) {
          return {
            name: entry.name,
            Companyname: updatedCompanyName,
            website: website,
          } as GoogleData;
        } else {
          throw new Error("Website not found on the page.");
        }
      },
      entry,
      updatedCompanyName
    );

    await randomTimeout(3, 5);
    
    return profiles;
  } catch (err) {
    console.error("An error occurred:", err);
    return err as Error;
  }
}
