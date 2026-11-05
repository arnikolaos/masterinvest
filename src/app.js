import {initContact} from './lib/contact-form.js';
import {initFloatingContact} from './lib/floating-contact.js';
import {initMotion} from './motion/index.js';
import {cinematicFilm} from './motion/film.js';
const locale=document.documentElement.lang;
const {t,emailConfig}=await import('./config-'+locale+'.js');
initContact({emailConfig,locale,t});initMotion(t);
const header=document.querySelector('.site-header');
const updateHeader=()=>header?.classList.toggle('is-scrolled',scrollY>40);
addEventListener('scroll',updateHeader,{passive:true});updateHeader();
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#mobile-nav');
function closeMenu(focus=false){if(!menu)return;menu.setAttribute('aria-expanded','false');nav.hidden=true;if(focus)menu.focus();}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));nav.hidden=open;});
nav?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true')closeMenu(true);});
matchMedia('(min-width: 761px)').addEventListener('change',()=>closeMenu());
document.querySelectorAll('[data-locale]').forEach(link=>link.addEventListener('click',()=>{
 if(link.dataset.locale===locale)return;
 const sections=[...document.querySelectorAll('main section[id]')];const section=sections.filter(s=>s.getBoundingClientRect().top<=150).at(-1)||sections[0];
 try{localStorage.setItem('mi:locale',link.dataset.locale);if(section)sessionStorage.setItem('mi:scroll',JSON.stringify({id:section.id,ratio:Math.max(0,-section.getBoundingClientRect().top/section.offsetHeight),target:link.dataset.locale,time:Date.now()}));}catch{/* Language URLs work without storage. */}
 if(section&&section.id!=='hero')link.hash=section.id;
}));
try{const raw=sessionStorage.getItem('mi:scroll');if(raw){sessionStorage.removeItem('mi:scroll');const saved=JSON.parse(raw);if(saved.target===locale&&Date.now()-saved.time<30000){const section=document.getElementById(saved.id);if(section){const restore=()=>scrollTo({top:section.offsetTop+section.offsetHeight*saved.ratio,behavior:'instant'});requestAnimationFrame(restore);window.addEventListener('load',restore,{once:true});}}}}catch{/* Ignore unavailable or invalid storage. */}
initFloatingContact();
const dialog=document.querySelector('.media-dialog');
if(dialog){const content=dialog.querySelector('.dialog-content'),caption=dialog.querySelector('#media-caption');let trigger;
 document.querySelectorAll('[data-viewer]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();trigger=link;const isVideo=link.dataset.mediaType==='video';const media=document.createElement(isVideo?'video':'img');media.src=link.href;if(isVideo){media.controls=true;media.playsInline=true;media.preload='metadata';media.poster=link.dataset.poster||'';}else{media.alt=link.dataset.caption;}content.replaceChildren(isVideo?cinematicFilm(media,link.dataset.caption):media);caption.textContent=link.dataset.caption;dialog.showModal();}));
 const close=()=>dialog.close();dialog.querySelector('.dialog-close').addEventListener('click',close);dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
 dialog.addEventListener('close',()=>{content.querySelector('.film-camera')?.cleanup();content.querySelector('video')?.pause();content.replaceChildren();trigger?.focus();});
}
