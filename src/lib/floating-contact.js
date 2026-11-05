// Direction hysteresis is independent of rendering, for desktop/touch checks.
export function scrollVisibility(state,y,now,{threshold=12,cooldown=160}={}) {
 const delta=y-state.y;state.y=y;
 if(Math.abs(delta)<2)return state.hidden;
 const direction=Math.sign(delta);
 if(direction!==state.direction){state.direction=direction;state.travel=0;}
 state.travel+=Math.abs(delta);
 if(state.travel>=threshold&&now-state.changedAt>=cooldown){
  const hidden=direction>0;
  if(hidden!==state.hidden){state.hidden=hidden;state.changedAt=now;}
  state.travel=0;
 }
 if(y<=2&&state.hidden){state.hidden=false;state.travel=0;state.changedAt=now;}
 return state.hidden;
}
export function initFloatingContact(){
 const button=document.querySelector('.floating-contact');if(!button)return;
 const touch=matchMedia('(pointer: coarse)');
 const position=()=>Math.max(0,Math.min(scrollY,Math.max(0,document.documentElement.scrollHeight-innerHeight)));
 const state={y:position(),direction:0,travel:0,hidden:false,changedAt:-Infinity};
 const excluded=new Set();const menu=document.querySelector('.menu-toggle');
 let frame=0,resizingUntil=0;
 function render(){
  const blocked=excluded.size>0||menu?.getAttribute('aria-expanded')==='true'||Boolean(document.querySelector('.media-dialog[open]'));
  const hidden=blocked||(state.hidden&&document.activeElement!==button);
  button.classList.toggle('is-hidden',hidden);button.tabIndex=hidden?-1:0;
  button.setAttribute('aria-hidden',String(hidden));button.inert=hidden;
 }
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){if(entry.isIntersecting)excluded.add(entry.target);else excluded.delete(entry.target);}render();
 });
 document.querySelectorAll('#contact,.footer').forEach(region=>observer.observe(region));
 function tick(){frame=0;const now=performance.now(),y=position();
  if(now<resizingUntil){state.y=y;state.direction=0;state.travel=0;return;}
  scrollVisibility(state,y,now,touch.matches?{threshold:24,cooldown:280}:{threshold:12,cooldown:160});render();
 }
 addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(tick);},{passive:true});
 function resize(){resizingUntil=performance.now()+(touch.matches?350:180);state.y=position();state.direction=0;state.travel=0;}
 addEventListener('resize',resize,{passive:true});window.visualViewport?.addEventListener('resize',resize,{passive:true});
 const navObserver=new MutationObserver(render);
 if(menu)navObserver.observe(menu,{attributes:true,attributeFilter:['aria-expanded']});
 const dialog=document.querySelector('.media-dialog');if(dialog)navObserver.observe(dialog,{attributes:true,attributeFilter:['open']});
 button.addEventListener('focus',render);button.addEventListener('blur',render);render();
}
