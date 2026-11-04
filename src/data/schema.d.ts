export type Locale = 'en' | 'el';
export type Localized = Record<Locale, string>;
export interface Project { id:string; title:Localized; location:Localized; type:'residential'|'hospitality'; stage:'concept'|'proposed'|'verified'; availability:'not-offered'|'owner-confirmed'; publicationRights:string; verified:boolean; media:string; video?:string; description:Localized }
export interface ContactInput { name:string; email:string; message:string; website?:string }
export interface EmailConfig { enabled:boolean; deliveryVerified?:boolean; serviceId:string; publicKey:string; notificationTemplate:string; autoreplyTemplate:string }
