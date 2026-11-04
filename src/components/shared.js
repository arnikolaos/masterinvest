export const esc = (value='') => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const arrow = '<svg class="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.3"/></svg>';
export const paragraphs = section => section.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('');
export const eyebrow = (n,text) => `<p class="eyebrow"><span>${n}</span>${esc(text)}</p>`;
export function picture(ctx,id,{hero=false,cls='',alt='',destination=false}={}) {
 const stem=ctx.url(`multimedia/${destination?'destinations':'architecture'}/${id}`);
 const width=destination?1920:1672;
 return `<picture class="${cls}"><source type="image/webp" srcset="${stem}-640.webp 640w, ${stem}-1200.webp 1200w, ${stem}-${width}.webp ${width}w" sizes="${hero?'100vw':'(max-width: 700px) 100vw, 55vw'}"><img src="${stem}.jpg" width="${width}" height="${destination?1280:941}" alt="${esc(alt)}" ${hero?'fetchpriority="high" loading="eager"':'loading="lazy"'} decoding="async"></picture>`;
}
export function sectionHead(ctx,key,n,classes='') {return `${eyebrow(n,ctx.t.labels[key])}<h2 class="section-title ${classes}" data-reveal>${esc(ctx.c[key].title)}</h2>`;}
