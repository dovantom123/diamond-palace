(()=>{
 if(!window.gsap||!window.ScrollTrigger)return;
 const main=document.querySelector('main');
 if(!main)return;
 gsap.registerPlugin(ScrollTrigger);
 const hero=main.querySelector('.hero');
 const heroHeading=hero?.querySelector('h1');
 const storyHeading=main.querySelector('#about h2');
 const wordHeadings=[heroHeading,storyHeading].filter(Boolean);
 // Keep one accessible heading label; decorative word masks retain emphasis.
 wordHeadings.forEach(h=>{
  if(h.querySelector('.motion-word'))return;
  h.setAttribute('aria-label',h.innerText.replace(/\s+/g,' ').trim());
  const walker=document.createTreeWalker(h,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{
   const fragment=document.createDocumentFragment();
   node.textContent.split(/(\s+)/).forEach(word=>{
    if(!word.trim()){fragment.append(document.createTextNode(word));return}
    const mask=document.createElement('span'),inner=document.createElement('span');
    mask.className='motion-word';mask.setAttribute('aria-hidden','true');
    inner.textContent=word;mask.append(inner);fragment.append(mask);
   });node.replaceWith(fragment);
  });
 });
 let media=null,refreshTimer=null,suspended=false,introPlayed=false;
 const scheduleRefresh=()=>{
  if(suspended)return;
  clearTimeout(refreshTimer);
  refreshTimer=setTimeout(()=>{refreshTimer=null;if(!suspended)ScrollTrigger.refresh()},140);
 };
 const startMotion=()=>{
  media?.revert();
  media=gsap.matchMedia();
  media.add({motion:'(prefers-reduced-motion: no-preference)',desktop:'(min-width:761px)',fine:'(hover:hover) and (pointer:fine)'},context=>{
   if(!context.conditions.motion)return;
   const desktop=context.conditions.desktop,cleanups=[];
   const ctx=gsap.context(()=>{
    if(hero&&!introPlayed&&hero.getBoundingClientRect().bottom>0){
     introPlayed=true;
     const intro=gsap.timeline({defaults:{ease:'power3.out'}});
     const eyebrow=hero.querySelector('.eyebrow');
     if(eyebrow)intro.from(eyebrow,{opacity:0,y:10,duration:.6},0);
     if(heroHeading)intro.from(heroHeading.querySelectorAll('.motion-word>span'),{yPercent:105,duration:.85,stagger:.055,clearProps:'transform'},.1);
     const support=gsap.utils.toArray('.wedding-tagline,.hero-copy>p,.hero-actions',hero);
     if(support.length)intro.from(support,{opacity:0,y:12,duration:.7,stagger:.07,clearProps:'transform,opacity'},.35);
    }
    const heroImage=hero?.querySelector('.hero-photo>img');
    if(heroImage)gsap.to(heroImage,{y:desktop?20:6,scale:desktop?1.015:1.005,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.7,invalidateOnRefresh:true}});
    gsap.utils.toArray('h2',main).forEach(h=>{
     // Content reached by an anchor or restored scroll position remains readable.
     if(h.getBoundingClientRect().bottom<0)return;
     if(h===storyHeading){
      gsap.from(h.querySelectorAll('.motion-word>span'),{yPercent:100,duration:.75,stagger:.03,ease:'power3.out',scrollTrigger:{trigger:h,start:'top 92%',once:true},clearProps:'transform'});
     }else{
      gsap.from(h,{opacity:0,duration:.55,ease:'power1.out',scrollTrigger:{trigger:h,start:'top 94%',once:true},clearProps:'opacity'});
     }
    });
    gsap.utils.toArray('.service-copy,.about-content>p,.about-values article,.steps article',main).forEach(el=>{
     if(el.getBoundingClientRect().bottom<0)return;
     gsap.from(el,{y:desktop?14:8,opacity:0,duration:.6,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'transform,opacity'});
    });
    // Only editorial imagery gets continuous travel. Hall details and forms stay stable.
    gsap.utils.toArray('.about-figure>img,.gallery img',main).forEach(el=>{
     const isAbout=!!el.closest('.about-figure'),travel=desktop?(isAbout?9:7):3;
     gsap.fromTo(el,{scale:isAbout?1:1.035,y:travel},{scale:isAbout?1.015:1.02,y:-travel,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:.8,invalidateOnRefresh:true}});
    });
    if(context.conditions.fine){
     gsap.utils.toArray('.gallery button',main).forEach(card=>{
      const rx=gsap.quickTo(card,'rotationX',{duration:.6,ease:'power3.out'}),ry=gsap.quickTo(card,'rotationY',{duration:.6,ease:'power3.out'});
      const move=e=>{const r=card.getBoundingClientRect();rx(gsap.utils.clamp(-1.5,1.5,-(e.clientY-r.top-r.height/2)/r.height*3));ry(gsap.utils.clamp(-1.5,1.5,(e.clientX-r.left-r.width/2)/r.width*3))};
      const reset=()=>{rx(0);ry(0)};
      card.addEventListener('pointermove',move);card.addEventListener('pointerleave',reset);card.addEventListener('blur',reset);
      cleanups.push(()=>{card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',reset);card.removeEventListener('blur',reset)});
     });
    }
   },main);
   return()=>{cleanups.forEach(fn=>fn());ctx.revert()};
  });
 };
 startMotion();
 document.fonts?.ready.then(scheduleRefresh);
 main.querySelectorAll('img').forEach(img=>{if(!img.complete)img.addEventListener('load',scheduleRefresh,{once:true})});
 addEventListener('pagehide',()=>{suspended=true;clearTimeout(refreshTimer);media?.revert();media=null});
 addEventListener('pageshow',e=>{if(e.persisted){suspended=false;introPlayed=true;startMotion();scheduleRefresh()}});
})();
