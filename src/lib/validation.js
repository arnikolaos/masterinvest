/** @param {import('../data/schema').ContactInput} input */
export function validateContact(input) {
 const name=input.name.trim(), email=input.email.trim(), message=input.message.trim();
 /** @type {Record<string,string>} */ const errors={};
 if(name.length<2 || name.length>100 || /[\r\n\x00-\x1f\x7f]/.test(name)) errors.name='nameError';
 if(email.length>254 || !/^[^\s<>@\x00-\x1f\x7f]+@[^\s<>@\x00-\x1f\x7f]+\.[^\s<>@\x00-\x1f\x7f]+$/.test(email)) errors.email='emailError';
 if(message.length<10 || message.length>5000 || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(message)) errors.message='messageError';
 return {valid:Object.keys(errors).length===0,errors,value:{name,email,message},spam:Boolean(input.website?.trim())};
}
