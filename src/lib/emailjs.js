import {validateContact} from './validation.js';
/** @param {import('../data/schema').EmailConfig} config */
export function isConfigured(config) {return config.enabled && [config.serviceId,config.publicKey,config.notificationTemplate,config.autoreplyTemplate].every(value=>typeof value==='string' && /^[A-Za-z0-9_-]+$/.test(value)) && config.serviceId!=='mistudio' && config.serviceId!=='primary_service';}
/**
 * Internal notification first, acknowledgement second. No automatic retries.
 * Templates MUST use escaped double-brace variables, not raw triple braces.
 * @param {import('../data/schema').EmailConfig} config
 * @param {import('../data/schema').ContactInput} input
 * @param {'en'|'el'} locale
 * @param {{fetchFn?:typeof fetch,wait?:(ms:number)=>Promise<void>}} dependencies
 */
export async function sendEnquiry(config,input,locale,dependencies={}) {
 if(!isConfigured(config)) throw new Error('NOT_CONFIGURED');
 const validation=validateContact(input);
 if(!validation.valid || validation.spam) throw new Error('INVALID_INPUT');
 const {name,email,message}=validation.value;
 const fetchFn=dependencies.fetchFn||fetch;
 const wait=dependencies.wait||((ms)=>new Promise(resolve=>setTimeout(resolve,ms)));
 const params={from_name:name,reply_email:email,message,locale,is_greek:locale==='el'};
 /** @param {string} template */
 async function send(template) {
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),15000);
  try {
   const response=await fetchFn('https://api.emailjs.com/api/v1.0/email/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service_id:config.serviceId,template_id:template,user_id:config.publicKey,template_params:params}),signal:controller.signal,credentials:'omit',referrerPolicy:'strict-origin-when-cross-origin'});
   if(!response.ok) throw new Error('DELIVERY_FAILED');
  } finally {clearTimeout(timer);}
 }
 await send(config.notificationTemplate);
 try {await wait(1100);await send(config.autoreplyTemplate);return {submitted:true,acknowledged:true};}
 catch {return {submitted:true,acknowledged:false};}
}
