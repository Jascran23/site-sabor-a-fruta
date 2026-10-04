document.querySelector('#year').textContent=new Date().getFullYear();

const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsap=window.gsap;
if(gsap&&window.ScrollTrigger&&!reducedMotion){
  gsap.registerPlugin(window.ScrollTrigger);
  const rows=gsap.utils.toArray('.flavor-row');
  rows.forEach((row,index)=>{
    const left=row.classList.contains('flavor-left');
    const copy=row.querySelector('.flavor-copy');
    const image=row.querySelector('.flavor-image');
    gsap.fromTo(copy,{autoAlpha:0,x:left?-48:48,y:18},{autoAlpha:1,x:0,y:0,ease:'none',scrollTrigger:{trigger:row,start:'top 61%',end:'top 25%',scrub:.8,invalidateOnRefresh:true}});
    gsap.fromTo(image,{autoAlpha:0,x:left?48:-48,y:24,scale:.95},{autoAlpha:1,x:0,y:0,scale:1,ease:'none',scrollTrigger:{trigger:row,start:'top 61%',end:'top 25%',scrub:.8,invalidateOnRefresh:true}});
  });
  gsap.fromTo('.track-progress',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:'.flavor-timeline',start:'top 42%',end:'bottom 18%',scrub:.8,invalidateOnRefresh:true}});
  gsap.fromTo('.timeline-hero h1',{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.8,ease:'power2.out',delay:.1});
  gsap.fromTo('.timeline-hero>p:not(.timeline-kicker)',{autoAlpha:0,y:15},{autoAlpha:1,y:0,duration:.65,ease:'power2.out',delay:.25});
  window.addEventListener('load',()=>window.ScrollTrigger.refresh(),{once:true});
}else{
  document.querySelectorAll('.flavor-row').forEach(row=>row.classList.add('is-visible'));
  document.querySelector('.track-progress').style.transform='scaleY(1)';
}

if(!('IntersectionObserver'in window))document.querySelectorAll('.flavor-row').forEach(row=>row.classList.add('is-visible'));
