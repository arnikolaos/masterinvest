export function initMotion(t) {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const hero=document.querySelector('.hero'),media=document.querySelector('[data-parallax]'),video=document.querySelector('.hero-video');
 const toggle=document.querySelector('.video-toggle'),motionButton=document.querySelector('.motion-toggle');
 let paused=false,frame=0,userVideo=false,userPausedVideo=false,heroVisible=true;
 const connection=navigator.connection;
 const constrained=()=>connection?.saveData || /(^|slow-)2g/.test(connection?.effectiveType||'');
 const canAnimate=()=>!reduced.matches&&!paused;
 function pauseVideo(){if(video){video.pause();video.classList.remove('is-playing');}if(toggle){toggle.textContent=t.play;toggle.setAttribute('aria-pressed','false');}}
 async function playVideo(){if(!video)return;if(!video.src)video.src=video.dataset.src;try{await video.play();video.classList.add('is-playing');draw();toggle.textContent=t.pause;toggle.setAttribute('aria-pressed','true');}catch{pauseVideo();}}
 toggle?.addEventListener('click',()=>{if(video.paused){userVideo=true;userPausedVideo=false;playVideo();}else{userVideo=false;userPausedVideo=true;pauseVideo();}});
 function autoplay(){if(canAnimate()&&!constrained()&&innerWidth>760&&heroVisible&&!document.hidden&&!userVideo&&!userPausedVideo)playVideo();}
 // Poster is the initial LCP; video is loaded only after the page settles.
 window.addEventListener('load',()=>setTimeout(autoplay,1600),{once:true});
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}}},{threshold:.06});
 document.querySelectorAll('[data-reveal]').forEach(el=>{if(canAnimate()&&el.getBoundingClientRect().top>innerHeight){el.classList.add('reveal-ready');observer.observe(el);}});
 function draw(){frame=0;if(media)media.style.transform=canAnimate()&&fine.matches&&heroVisible&&!video?.classList.contains('is-playing')?`translateY(${Math.min(scrollY*.04,24)}px)`:'';}
 addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(draw);},{passive:true});
 hero?.addEventListener('pointermove',e=>{if(!canAnimate()||!fine.matches)return;const rect=hero.getBoundingClientRect();hero.style.setProperty('--pointer-x',((e.clientX/rect.width)*100)+'%');hero.style.setProperty('--pointer-y',((e.clientY-rect.top)/rect.height*100)+'%');},{passive:true});
 if(hero)new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;if(!heroVisible)pauseVideo();else autoplay();}).observe(hero);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseVideo();else autoplay();});
 video?.addEventListener('error',pauseVideo);
 function refresh(){document.documentElement.classList.toggle('motion-paused',paused||reduced.matches);motionButton?.setAttribute('aria-pressed',String(paused||reduced.matches));if(motionButton)motionButton.textContent=paused?t.motionOn:t.motionOff;if(!canAnimate())pauseVideo();draw();}
 motionButton?.addEventListener('click',()=>{paused=!paused;refresh();if(!paused)autoplay();});
 reduced.addEventListener('change',refresh);refresh();
}
