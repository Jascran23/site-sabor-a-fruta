const header=document.querySelector('.header');
const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
const setHeader=()=>header.classList.toggle('scrolled',window.scrollY>16);
window.addEventListener('scroll',setHeader,{passive:true});setHeader();
menuButton.addEventListener('click',()=>{const isOpen=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!isOpen));menuButton.setAttribute('aria-label',isOpen?'Abrir menu':'Fechar menu');nav.classList.toggle('open',!isOpen)});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu')}));
document.querySelector('#year').textContent=new Date().getFullYear();

const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsap=window.gsap;
if(gsap&&window.ScrollTrigger&&!reducedMotion){
  gsap.registerPlugin(window.ScrollTrigger);
  document.querySelectorAll('.reveal').forEach(element=>{
    element.classList.add('gsap-managed');
    gsap.fromTo(element,{autoAlpha:0,y:34},{autoAlpha:1,y:0,ease:'none',scrollTrigger:{trigger:element,start:'top 59%',end:'top 31%',scrub:.7,invalidateOnRefresh:true}});
  });

  gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.8,invalidateOnRefresh:true}})
    .to('.hero-pouch',{y:-82,rotation:11,scale:.88,ease:'none'},0)
    .to('.hero-photo',{scale:1.1,ease:'none'},0)
    .to('.hero-sticker',{y:-35,rotation:18,ease:'none'},0);

  gsap.utils.toArray('.popular-card').forEach((card,index)=>{
    gsap.fromTo(card,{y:48,autoAlpha:0},{y:0,autoAlpha:1,ease:'none',scrollTrigger:{trigger:card,start:'top 62%',end:'top 28%',scrub:.65},delay:index*.04});
  });
  gsap.fromTo('.campaign-image',{scale:1.1},{scale:1,ease:'none',scrollTrigger:{trigger:'.campaign',start:'top bottom',end:'bottom top',scrub:.8}});
  window.addEventListener('load',()=>window.ScrollTrigger.refresh(),{once:true});
}else{
  document.querySelectorAll('.reveal').forEach(element=>element.classList.add('visible'));
}
