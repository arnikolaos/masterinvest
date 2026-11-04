// Retain the original video URL and native controls. Its clock drives the
// photographic composition; decoded video pixels are positioned out of view.
export function cinematicFilm(video,caption) {
 const frame=document.createElement('div');frame.className='film-camera';
 const photo=document.createElement('img');photo.src=video.poster;photo.alt=caption||'';photo.className='film-photo';photo.width=1280;photo.height=720;
 frame.append(photo,video);video.classList.add('film-clock');video.loop=true;video.muted=true;
 let animation,raf=0,started=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const disabled=()=>reduced.matches||document.documentElement.classList.contains('motion-paused');
 function sync(){
  const active=photo.getAnimations()[0];if(active!==animation){animation=active;animation?.pause();}
  if(animation&&Number.isFinite(video.duration)&&video.duration>0)animation.currentTime=disabled()?0:video.currentTime/video.duration*25000;
 }
 function tick(){sync();if(!video.paused&&!video.ended&&!disabled())raf=requestAnimationFrame(tick);}
 function pause(){cancelAnimationFrame(raf);frame.classList.remove('film-running');}
 function play(){if(disabled()){video.pause();return;}if(!started){frame.classList.add('film-started');started=true;}frame.classList.add('film-running');cancelAnimationFrame(raf);tick();}
 function motion(){if(disabled()){video.pause();pause();if(animation)animation.currentTime=0;}}
 video.addEventListener('loadedmetadata',()=>{video.playbackRate=video.duration/25;sync();});
 video.addEventListener('play',play);video.addEventListener('pause',pause);video.addEventListener('seeking',sync);
 video.addEventListener('error',()=>{pause();frame.classList.add('film-error');});
 document.addEventListener('mi:motion-change',motion);reduced.addEventListener('change',motion);
 const fullscreen=()=>{if(document.fullscreenElement===video)frame.requestFullscreen?.().catch(()=>{});};
 document.addEventListener('fullscreenchange',fullscreen);
 document.addEventListener('visibilitychange',hidden);function hidden(){if(document.hidden)video.pause();}
 frame.cleanup=()=>{pause();video.pause();animation?.cancel();document.removeEventListener('mi:motion-change',motion);reduced.removeEventListener('change',motion);document.removeEventListener('visibilitychange',hidden);document.removeEventListener('fullscreenchange',fullscreen);if(document.fullscreenElement===frame)document.exitFullscreen?.().catch(()=>{});};
 return frame;
}
