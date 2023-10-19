

import { GoogleData } from "../models/googleData";
  const validator1 = require('../EmailValidation/Validate');
  import { VerifiedEmails } from "../models/VerifiedEmail";
  export async function CreateCombo(data:GoogleData[]){
    const Combos:VerifiedEmails[]=[]
    const ValidEmails:string[]=[]
  const certifications:string[] = [
    "MDA",
    "CFE",
    "M.SC",
    "CISM",
    "CPA",
    "PMP",
    "CCNA",
    "CEH",
    "CISSP",
    "MCSE",
    "CCA",
    "CFA",
    "PHR",
    "SHRM-CP",
    "SHRM-SCP",
    "A+",
    "N+",
    "CCNP",
    "CompTIA Security+",
    "CISA",
    "ITIL",
    "Six Sigma Green Belt",
    "Six Sigma Black Belt",
    "CAPM",
    "AWS Certified Solutions Architect",
    "AWS Certified Developer",
    "AWS Certified SysOps Administrator",
    "Google Cloud Professional Cloud Architect",
    "Google Cloud Professional Data Engineer",
    "CSM",
    "CSPO",
    "CEH",
    "CISM",
    "CISA",
    "CBCP",
    "CCSP",
    "CIPP",
    "CompTIA A+",
    "CompTIA Network+",
    "CompTIA Project+",
    "CompTIA Linux+",
    "CompTIA Server+",
    "CompTIA Cloud+",
    "CompTIA CySA+",
    "CompTIA PenTest+",
    "CKA",
    "CKAD",
    "CDP",
    "CAP",
    "CISSO",
    "CCSK",
    "CRISC",
    "CISM",
    "CISA",
    "CISSP",
    "CCSP",
    "CIPP",
    "CSM",
    "CSPO",
    "CEH",
    "CPT",
    "CISSO",
    "CISM",
    "CISA",
    "CISSP",
    "CCSP",
    "CIPP",
    "CSM",
    "CSPO",
    "CEH",
    "CPT",
    "CISSO",
    "CISM",
    "CISA",
    "CISSP",
    "CCSP",
    "CIPP",
    "CSM",
    "CSPO",
    "CEH",
    "CPT",
    "CISSO",
    "CISM",
    "CISA",
    "CISSP",
    "CCSP",
    "CIPP",
    "CSM",
    "CSPO",
    "CEH",
    "CPT",
    "CISSO",
    "CISM",
    "CISA",
    "CISSP",
    "CCSP",
    "CIPP",
    "CSM",
    "CSPO",
    "CEH",
    "CPT",
    "CISSO",
    "CISM",
    "CISA",
    "CISSP",
    "CCSP",
    "CIPP",
    "CSM",
    "CSPO",
    "CEH",
    "CPT",
    "CISSO",
    "CISM",
    "CISA",
    "CISSP",
    "CCSP",
    "CIPP",
    "CSM",
    "CSPO",
    "CEH",
    "CPT",
  ];
  async function validateEmail(el:string,tld:string[]):Promise<boolean> {
    try {
      const output = await validator1(el,tld);
      console.log("SMTP status for", el, ":", output);
       if(output.valid)
       {
        return output.valid
       }
       else
       {
        if(output.validators.smtp.reason==='SMTP Error: The mailbox that you are trying to reach is busy. Wait a little while and try again.')
        {
          return true;
        }
        else{
          return false;
        }
       }
      // return output.valid;
    } catch (error) {
      console.error("Error checking SMTP status for", el, ":", error);
      throw error; // Rethrow the error to propagate it up.
    }
  }

  
  const emojiRegex:RegExp = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]|[\u2300-\u23FF]|[\u2B50]|[\u203C-\u3299\u00A9\u00AE]\uFE0F?/g;
  const pattern:RegExp = new RegExp(`(?:\\s|^)(${certifications.join("|")})(?:\\s|$)`, "g");
  
  function generateCombinations(arr:string[], domain:string|null):string[] {
    const combinations:Set<string>= new Set();
    
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const arr1:string = arr[i].toLowerCase();
    const arr2:string = arr[j].toLowerCase();
    
    const combination:string = `${arr1}${arr2}@${domain}`;
    const combination1:string = `${arr1}.${arr2}@${domain}`;
    const combination2:string = `${arr1}@${domain}`;
    const combination3:string = `${arr1.charAt(0)}.${arr2}@${domain}`;
    const combination4:string = `${arr1.charAt(0)}${arr2}@${domain}`;
    const combination5:string= `${arr2}${arr1}@${domain}`;
    const combination6:string= `${arr2}.${arr1}@${domain}`;
    const combination7:string= `${arr2}@${domain}`;
    const combination8:string= `${arr2.charAt(0)}.${arr1}@${domain}`;
    const combination9:string= `${arr2.charAt(0)}${arr1}@${domain}`;
    const combination10:string= `${arr2.charAt(0)}${arr1.charAt(0)}@${domain}`;
    const combination11:string= `${arr2.charAt(0)}.${arr1.charAt(0)}@${domain}`;
    const combination12:string= `${arr1.charAt(0)}${arr2.charAt(0)}@${domain}`;
    const combination13:string= `${arr1.charAt(0)}.${arr2.charAt(0)}@${domain}`;
 
   
    combinations.add(combination);
    combinations.add(combination1);
    combinations.add(combination2);
    combinations.add(combination3);
    combinations.add(combination4);
    combinations.add(combination5);
    combinations.add(combination6);
    combinations.add(combination7);
    combinations.add(combination8);
    combinations.add(combination9);
    combinations.add(combination10);
    combinations.add(combination11);
    combinations.add(combination12);
    combinations.add(combination13);
  console.log("the combinations are:",combinations);
  }
    }
    console.log("the array data is combo",Array.from(combinations));
    return Array.from(combinations);
  }
  function processName(name:string):string {
    // Remove non-English characters in brackets
    name = name.replace(/\(([^A-Za-z]+)\)/g, '');
  
    // Remove English characters in all caps in brackets
    name = name.replace(/\(([A-Z]+)\)/g, '');
  
    // Remove brackets for remaining English characters
    name = name.replace(/\(([^)]+)\)/g, '$1 ');
  
    return name.trim(); // Trim any leading/trailing spaces
  }
  const updatedData:GoogleData[] = data.map((entry:GoogleData) => {
    // Split the name by comma and take the first part
    const nameParts:string[] = entry.name.split(',');
    let updatedName:string = nameParts[0].trim();
    if (updatedName.startsWith("Dr.")) {
        updatedName = updatedName.substring(3).trim();
      }
       updatedName =updatedName.replace(emojiRegex,'').trim();
       updatedName=processName(updatedName);
       updatedName = updatedName.replace(pattern, "");
        updatedName = updatedName.replace(/-/g, " ");
    // Create a new object with the updated name and the same link
    return {
      name: updatedName,
      Companyname:entry.Companyname,
      website:entry.website,
      domain:" ",
      Industry:entry.Industry,
      CompanySize:entry.CompanySize,
      Headquater:entry.Headquater,
      Type:entry.Type,
      Founded:entry.Founded
    };
  });


  for(let entry of updatedData)
  {
    const wordsArray:string[] = entry.name.split(' ');
    // console.log("words",wordsArray);
    let domain = entry.website
    ? entry.website.match(/^(https?:\/\/)?(www\.)?([^\/]+)/)
    : null;
    

      const mini=domain&&generateCombinations(wordsArray,domain[3])
      console.log("before for",mini);
    
   
   
    let tld:string[]=[];
    const parts:string[]|null = domain&&domain[3]?.split('.'); // Split the domain by "."
    if (parts && parts.length > 1) {
      let res:string = parts[parts.length - 1]; // Use the last part as the TLD
      // console.log(tld); // Output the extracted TLD
      tld.push(res);
    }
    var result;
    const TrueEmails:string[]=[];
    if(mini)
    {
      for(let el of mini)
      {
        result=await validateEmail(el,tld)
        if(result)
        {
          TrueEmails.push(el)
        }
      }
    }
   
    // console.log("after for");
    if(mini?.length==TrueEmails.length||TrueEmails.length>=4)
    {
        Combos.push({
            name:entry.name,
            Companyname:entry.Companyname,
            website:entry.website,
            domain:domain?domain[3]:null,
            Industry:entry.Industry,
            CompanySize:entry.CompanySize,
            Headquater:entry.Headquater,
            Type:entry.Type,
            Founded:entry.Founded,
            ValidEmail:TrueEmails,
            Status:"catchall"
          })
    }
    else
    {
        if(TrueEmails.length==0)
        {
            Combos.push({
                name:entry.name,
                Companyname:entry.Companyname,
                website:entry.website,
                domain:domain?domain[3]:null,
                Industry:entry.Industry,
                CompanySize:entry.CompanySize,
                Headquater:entry.Headquater,
                Type:entry.Type,
                Founded:entry.Founded,
                ValidEmail:TrueEmails,
                Status:"no emails found"
              })   
        }
        else
        {
            Combos.push({
                name:entry.name,
                Companyname:entry.Companyname,
                website:entry.website,
                domain:domain?domain[3]:null,
                Industry:entry.Industry,
                CompanySize:entry.CompanySize,
                Headquater:entry.Headquater,
                Type:entry.Type,
                Founded:entry.Founded,
                ValidEmail:TrueEmails,
                Status:"valid"
              })
        }
      
    }
   
  }
  return Combos;
  
}
  

