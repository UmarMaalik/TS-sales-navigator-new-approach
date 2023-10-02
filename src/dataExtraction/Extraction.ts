import { Page } from "puppeteer";
import { randomTimeout } from "../Timeout/Timeout";
import {ElementHandle} from 'puppeteer'
import { ProfileData } from "../models/ProfileData";
export async function ExtractData(page:Page):Promise<ProfileData[]>{
    await page.waitForSelector(".artdeco-list__item", { timeout: 10000 });
    try{
      await page.waitForSelector(".artdeco-entity-lockup__subtitle", {
        timeout: 20000,
      }); 
    }
    catch(error)
    {
      console.log("cannot find .artdeco-entity-lockup__subtitle")
    }

    await randomTimeout(1,4)
    await page.waitForSelector("#search-results-container", { timeout: 10000 });
    const searchResultsContainer:ElementHandle<Element> | null = await page.$("#search-results-container");
  
    if (searchResultsContainer) {
      const scrollIncrement:number = 100; // Adjust the scroll increment as needed
      let currentScroll:number = 0;
      const containerHeight:number = await page.$eval(
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
  
        await randomTimeout(2,6)
  
        const newScroll:number = await page.$eval(
          "#search-results-container",
          (element) => element.scrollTop
        );
  
        if (newScroll === currentScroll) {
          break;
        }
  
        currentScroll = newScroll;
      }
    } else {
      console.error("Search results container not found.");
    }
  
    // Wait for a while to observe the effect (optional)
  
    const profiles = await page.evaluate(() => {
      let Profdata: ProfileData[] = [];
      const profileContainers:NodeList = document.querySelectorAll(".artdeco-list__item");
      console.log("the containers are:", profileContainers);
      const arrayFromNodeList = Array.from(profileContainers);
      for (const container of arrayFromNodeList) {
        const containerElement = container as Element;
        const CompanyHref:HTMLAnchorElement | null= containerElement.querySelector(
          ".artdeco-entity-lockup__subtitle a"
        );
        const TempName:HTMLDivElement | null = containerElement.querySelector(".artdeco-entity-lockup__title");
        const PerName:string = TempName ? TempName.innerText : "not found!!!!";
        // const Des:HTMLDivElement | null = containerElement.querySelector(".artdeco-entity-lockup__subtitle");
        const Des:string | undefined = CompanyHref?.innerText;
       let tempDesigniation:string=Des?Des:"designiation not found"
        // let firstName:string =" "
        // let secondName:string =" "
        // if(PerName)
        // {
        //   let newTemp=PerName.split(' ')
        //   if(newTemp.length==2)
        //   {
        //     firstName=newTemp[0]
        //     secondName=newTemp[1]
        //   }
        //   else
        //   {
            
        //     firstName=newTemp[0]
        //     const yArray: string[] = newTemp?.slice(1);
        //     secondName=yArray.join(' ');
        //   }
         
        // }
        const href:string|null = CompanyHref ? CompanyHref.getAttribute("href") : null;
        
        if (href) {
          Profdata.push({
            fullname:PerName,
            firstName:" ",
            secondName:" ",
            designiation:tempDesigniation,
            CompanyLinkedinLink: href,
            website:" ",
            domain:""
          });
        }
      }
  
      return Profdata;
    });
    console.log("the data is", profiles);
    console.log("the total records are", profiles.length);
    if(profiles)
    {
      
    }
    return profiles;
}