(()=>{
 if(!window.gsap||!window.ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);
 const main=document.querySelector('main'),mm=gsap.matchMedia();
 const headings=gsap.utils.toArray('h1,h2');
 // Split words while preserving emphasis and a single accessible heading name.
 headings.forEach(h=>{
   h.setAttribute('aria-label',h.innerText.replace(/\s+/g,' ').trim());
   const walker=document.createTreeWalker(h,NodeFilter.SHOW_TEXT),nodes=[];
   while(walker.nextNode())nodes.push(walker.currentNode);
   nodes.forEach(node=>{
    const fragment=document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(word=>{
     if(!word.trim()){fragment.append(document.createTextNode(word));return}
     const mask=document.createElement('span'),inner=document.createElement('span');
     mask.className='motion-word';mask.setAttribute('aria-hidden','true');inner.textContent=word;mask.append(inner);fragment.append(mask);
    });node.replaceWith(fragment);
   });
 });
 mm.add({motion:'(prefers-reduced-motion: no-preference)',desktop:'(min-width:761px)',fine:'(hover:hover) and (pointer:fine)'},context=>{
  if(!context.conditions.motion)return;
  const desktop=context.conditions.desktop,cleanups=[];
  const ctx=gsap.context(()=>{
   const intro=gsap.timeline({defaults:{ease:'power3.out'}});
   intro.from('.hero .eyebrow',{opacity:0,y:14,duration:.7})
    .from('.hero h1 .motion-word>span',{yPercent:110,rotationX:-12,duration:1,stagger:.085},.12)
    .from('.wedding-tagline,.hero-copy>p,.hero-actions',{opacity:0,y:20,duration:.85,stagger:.1},.5);
   const hero=document.querySelector('.hero');
   const depth=gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.75,invalidateOnRefresh:true}});
   depth.to('.hero-photo>img',{y:desktop?65:16,scale:1.035,ease:'none'},0)
    .to('.hero-atmosphere',{y:desktop?22:7,opacity:.55,ease:'none'},0)
    .to('.hero-foreground',{y:desktop?-55:-18,scale:desktop?1.09:1.035,ease:'none'},0)
    .to('.hero-copy',{y:desktop?-22:-7,ease:'none'},0);
   gsap.utils.toArray('h2').forEach(h=>{
    gsap.from(h.querySelectorAll('.motion-word>span'),{yPercent:108,duration:.85,stagger:.035,ease:'power3.out',scrollTrigger:{trigger:h,start:'top 91%',once:true},clearProps:'transform'});
   });
   gsap.utils.toArray('.service-copy,.about-content>p,.about-values article,.steps article,.contact-grid form').forEach(el=>{
    gsap.from(el,{y:20,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'transform,opacity'});
   });
   gsap.utils.toArray('.about-figure>img,.hall-visual>img,.gallery img,.service img').forEach(el=>{
    const isAbout=el.closest('.about-figure');
    gsap.fromTo(el,{scale:isAbout?1:1.055,y:isAbout?14:9},{scale:isAbout?1.025:1.015,y:isAbout?-14:-9,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:.8}});
   });
   if(context.conditions.fine){
    gsap.utils.toArray('.gallery button').forEach(card=>{
     const rx=gsap.quickTo(card,'rotationX',{duration:.65,ease:'power3.out'}),ry=gsap.quickTo(card,'rotationY',{duration:.65,ease:'power3.out'});
     const move=e=>{const r=card.getBoundingClientRect();rx(gsap.utils.clamp(-2,2,-(e.clientY-r.top-r.height/2)/r.height*4));ry(gsap.utils.clamp(-2,2,(e.clientX-r.left-r.width/2)/r.width*4))};
     const reset=()=>{rx(0);ry(0)};
     card.addEventListener('pointermove',move);card.addEventListener('pointerleave',reset);card.addEventListener('blur',reset);
     cleanups.push(()=>{card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',reset);card.removeEventListener('blur',reset)});
    });
   }
  },main);
  return()=>{cleanups.forEach(fn=>fn());ctx.revert()};
 });
 document.fonts.ready.then(()=>ScrollTrigger.refresh());
 document.querySelectorAll('img').forEach(img=>{if(!img.complete)img.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true})});
 addEventListener('pagehide',()=>mm.revert(),{once:true});
 addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
})();
