export function initMotion(t) {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const hero=document.querySelector('.hero');
 const toggle=document.querySelector('.video-toggle'),motionButton=document.querySelector('.motion-toggle');
 let paused=false,heroPaused=false,heroVisible=true;
 const constrained=navigator.connection?.saveData;
 function refresh(){
  const disabled=paused||reduced.matches;
  document.documentElement.classList.toggle('motion-paused',disabled);
  const running=!disabled&&!heroPaused&&!constrained&&heroVisible&&!document.hidden;
  hero?.classList.toggle('camera-running',running);
  if(!disabled&&!constrained)hero?.classList.add('camera-started');
  toggle?.setAttribute('aria-pressed',String(running));if(toggle)toggle.textContent=running?t.pause:t.play;
  motionButton?.setAttribute('aria-pressed',String(disabled));if(motionButton)motionButton.textContent=paused?t.motionOn:t.motionOff;
  document.dispatchEvent(new Event('mi:motion-change'));
 }
 toggle?.addEventListener('click',()=>{heroPaused=!heroPaused;refresh();});
 motionButton?.addEventListener('click',()=>{paused=!paused;refresh();});
 reduced.addEventListener('change',refresh);document.addEventListener('visibilitychange',refresh);
 if(hero)new IntersectionObserver(([e])=>{heroVisible=e.isIntersecting;refresh();}).observe(hero);
 const observer=new IntersectionObserver(entries=>{
  let stagger=0;for(const e of entries){if(e.isIntersecting){e.target.style.transitionDelay=`${Math.min(stagger++,3)*100}ms`;e.target.classList.add('revealed');observer.unobserve(e.target);}}
 },{threshold:0.05});
 const candidates=document.querySelectorAll('main section:not(#hero) h2, main section:not(#hero) h3, main section:not(#hero) p, main section:not(#hero) picture, .destination-card, .venture-card, .lifecycle-steps li, .disciplines li, #contact .field, #contact address, #contact .contact-links');
 // Cards reveal as a unit; avoid stacking transforms on their children.
 candidates.forEach(el=>{if(el.closest('dialog')||el.parentElement.closest('.destination-card,.venture-card'))return;if(!reduced.matches&&el.getBoundingClientRect().top>=innerHeight){el.classList.add('reveal-ready');observer.observe(el);}});
 hero?.addEventListener('pointermove',e=>{if(paused||reduced.matches||e.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();hero.style.setProperty('--pointer-x',`${e.clientX/r.width*100}%`);hero.style.setProperty('--pointer-y',`${(e.clientY-r.top)/r.height*100}%`);},{passive:true});
 refresh();
}
