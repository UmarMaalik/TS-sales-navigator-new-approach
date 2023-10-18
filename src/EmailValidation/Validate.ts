// import { validate } from 'deep-email-validator';
const Validate= require('deep-email-validator')
async function main(email:string,adtionalDomain:string[]){
    console.log("iam in validator 1",adtionalDomain);
  // Can also be called with these default options
  return Validate.validate({
    email: email,
    sender: 'name@example.org',
    validateRegex: true,
    validateMx: true,
    validateTypo: true,
    validateDisposable: true,
    validateSMTP: true,
    additionalTopLevelDomains:adtionalDomain,
  });
}; 

// main().then(console.log).catch(console.error)
module.exports=main;