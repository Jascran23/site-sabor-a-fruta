// Mude para false para deixar os reveals visíveis sem animação durante capturas de tela.
const ENABLE_REVEAL_ANIMATIONS=false;

const header=document.querySelector('.header');
const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
const setHeader=()=>header.classList.toggle('scrolled',window.scrollY>16);
window.addEventListener('scroll',setHeader,{passive:true});setHeader();
menuButton.addEventListener('click',()=>{const isOpen=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!isOpen));menuButton.setAttribute('aria-label',isOpen?'Abrir menu':'Fechar menu');nav.classList.toggle('open',!isOpen)});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu')}));
document.querySelector('#year').textContent=new Date().getFullYear();
// Edite esta lista para incluir, remover ou reorganizar os sabores da faixa.
const pulpFlavors=[
  {name:'Goiaba',target:'#produtos'},
  {name:'Abacaxi',target:'#produtos'},
  {name:'Caju',target:'#produtos'},
  {name:'Maracujá',target:'#produtos'},
  {name:'Cajá',target:'#produtos'},
  {name:'Manga',target:'#produtos'},
  {name:'Tangerina',target:null}
];
const flavorCarousel=document.querySelector('[data-flavor-carousel]');
if(flavorCarousel&&pulpFlavors.length){
  const createFlavorSet=(isDuplicate=false)=>{
    const set=document.createElement('div');
    set.className='flavor-set';
    if(isDuplicate){set.setAttribute('aria-hidden','true');set.inert=true;}
    set.innerHTML=pulpFlavors.map((flavor,index)=>{
      const href=flavor.target?` href="${flavor.target}"`:'';
      const tabindex=isDuplicate?' tabindex="-1"':'';
      return `<a${href}${tabindex}>${flavor.name}</a>`;
    }).join('');
    return set;
  };
  const flavorTrack=document.createElement('div');
  flavorTrack.className='flavor-track';
  const firstFlavorSet=createFlavorSet();
  flavorTrack.append(firstFlavorSet,createFlavorSet(true));
  flavorCarousel.append(flavorTrack);
  const fillFlavorTrack=()=>{
    const setWidth=firstFlavorSet.getBoundingClientRect().width;
    if(!setWidth)return;
    while((flavorTrack.children.length/2)*setWidth<flavorCarousel.clientWidth){
      flavorTrack.append(createFlavorSet(true),createFlavorSet(true));
    }
  };
  fillFlavorTrack();
  new ResizeObserver(fillFlavorTrack).observe(flavorCarousel);
}

const companyTablist=document.querySelector('[role="tablist"][aria-label="Missão, visão e valores"]');
if(companyTablist){
  const companyTabs=[...companyTablist.querySelectorAll('[role="tab"]')];
  const companyPanels=[...document.querySelectorAll('[data-company-panel]')];
  const activateCompanyTab=(tab,focus=false)=>{
    companyTabs.forEach(item=>{
      const selected=item===tab;
      item.setAttribute('aria-selected',String(selected));
      item.tabIndex=selected?0:-1;
    });
    companyPanels.forEach(panel=>{
      panel.hidden=panel.id!==tab.getAttribute('aria-controls');
    });
    if(focus)tab.focus();
  };
  companyTabs.forEach(tab=>tab.addEventListener('click',()=>activateCompanyTab(tab)));
  companyTablist.addEventListener('keydown',event=>{
    const current=companyTabs.indexOf(document.activeElement);
    if(current<0)return;
    let next=current;
    if(event.key==='ArrowRight')next=(current+1)%companyTabs.length;
    else if(event.key==='ArrowLeft')next=(current-1+companyTabs.length)%companyTabs.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=companyTabs.length-1;
    else return;
    event.preventDefault();
    activateCompanyTab(companyTabs[next],true);
  });
}

const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsap=window.gsap;
if(gsap&&window.ScrollTrigger&&!reducedMotion){
  gsap.registerPlugin(window.ScrollTrigger);
  if(ENABLE_REVEAL_ANIMATIONS){
    document.querySelectorAll('.reveal').forEach(element=>{
      if(element.closest('.gallery,.quality'))return;
      element.classList.add('gsap-managed');
      gsap.fromTo(element,{autoAlpha:0,y:34},{autoAlpha:1,y:0,ease:'none',scrollTrigger:{trigger:element,start:'top 59%',end:'top 31%',scrub:.7,invalidateOnRefresh:true}});
    });

    const animateSectionEntrance=(selector,trigger,start,stagger)=>{
      const elements=gsap.utils.toArray(selector);
      if(!elements.length)return;
      elements.forEach(element=>element.classList.add('gsap-managed'));
      gsap.timeline({scrollTrigger:{trigger,start,toggleActions:'play none none reverse',invalidateOnRefresh:true}})
        .fromTo(elements,{autoAlpha:0,y:26},{autoAlpha:1,y:0,duration:.65,stagger,ease:'power2.out'});
    };
    animateSectionEntrance('.gallery .reveal','.gallery','top 82%',.09);
    animateSectionEntrance('.quality .reveal','.quality','top 82%',.1);

    gsap.utils.toArray('.popular-card').forEach((card,index)=>{
      gsap.fromTo(card,{y:48,autoAlpha:0},{y:0,autoAlpha:1,ease:'none',scrollTrigger:{trigger:card,start:'top 62%',end:'top 28%',scrub:.65},delay:index*.04});
    });
  }else{
    document.querySelectorAll('.reveal').forEach(element=>element.classList.add('visible'));
  }

  gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.8,invalidateOnRefresh:true}})
    .to('.hero-product',{y:-82,rotation:11,scale:.88,ease:'none'},0)
    .to('.hero-photo',{scale:1.1,ease:'none'},0)
    .to('.hero-sticker',{y:-35,rotation:18,ease:'none'},0);

  gsap.fromTo('.campaign-photo-main > img',{scale:1.05},{scale:1,ease:'none',scrollTrigger:{trigger:'.campaign',start:'top bottom',end:'bottom top',scrub:.8}});
  window.addEventListener('load',()=>window.ScrollTrigger.refresh(),{once:true});
}else{
  document.querySelectorAll('.reveal').forEach(element=>element.classList.add('visible'));
}
