import {validateContact} from './validation.js';
import {isConfigured,sendEnquiry} from './emailjs.js';
export function initContact({emailConfig,locale,t}) {
 const form=document.querySelector('#contact-form');if(!form)return;
 const status=form.querySelector('.form-status'),button=form.querySelector('[type=submit]');
 const fields=['name','email','message'];let busy=false;let lastAttempt=0;
 try {lastAttempt=Number(sessionStorage.getItem('mi:last-send'))||0;}catch{/* Storage is optional. */}
 form.addEventListener('input',event=>{const field=event.target;if(fields.includes(field.name)){field.removeAttribute('aria-invalid');document.getElementById(field.name+'-error').textContent='';}});
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  const input=Object.fromEntries(new FormData(form));
  const validation=validateContact(input);
  fields.forEach(name=>{const error=validation.errors[name];form.elements[name].setAttribute('aria-invalid',String(Boolean(error)));document.getElementById(name+'-error').textContent=error?t[error]:'';});
  if(!validation.valid){status.textContent=t.invalid;form.elements[Object.keys(validation.errors)[0]].focus();return;}
  if(validation.spam){status.textContent=t.error;return;}
  if(!isConfigured(emailConfig)){status.textContent=t.unavailable;status.focus();return;}
  if(Date.now()-lastAttempt<60000){status.textContent=t.cooldown;return;}
  lastAttempt=Date.now();try{sessionStorage.setItem('mi:last-send',String(lastAttempt));}catch{/* Storage is optional. */}
  busy=true;button.disabled=true;form.setAttribute('aria-busy','true');const original=button.innerHTML;button.textContent=t.sending;status.textContent=t.sending;
  try {const result=await sendEnquiry(emailConfig,input,locale);status.textContent=t.success;form.reset();if(!result.acknowledged)console.warn('MASTER INVEST: enquiry accepted; acknowledgement unavailable.');}
  catch{status.textContent=t.error;}
  finally{busy=false;button.disabled=false;button.innerHTML=original;form.removeAttribute('aria-busy');status.focus();}
 });
}
