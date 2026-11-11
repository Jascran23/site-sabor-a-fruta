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

// Edite este array para adicionar, remover ou reorganizar os cards do carrossel.
const showcaseProducts=[
  {name:'Goiaba',description:'Doce, perfumada e cheia de brasilidade.',image:'assets/images/insta-goiaba.webp',alt:'Arte promocional da polpa de goiaba Sabor a Fruta',width:865,height:1080,fit:'cover'},
  {name:'Abacaxi',description:'Um toque tropical a cada receita.',image:'assets/images/insta-abacaxi.jpg',webp:'assets/images/optimized-insta-abacaxi.webp',alt:'Arte promocional da polpa de abacaxi Sabor a Fruta',width:1080,height:1080,fit:'cover'},
  {name:'Caju',description:'Um sabor marcante e genuinamente brasileiro.',image:'assets/images/insta-caju.jpg',webp:'assets/images/optimized-insta-caju.webp',alt:'Arte promocional da polpa de caju Sabor a Fruta',width:1080,height:1080,fit:'cover'},
  {name:'Maracujá',description:'Marcante do primeiro ao último sabor.',image:'assets/images/polpa-maracuja.png',webp:'assets/images/optimized-polpa-maracuja-800.webp',alt:'Embalagem da polpa de maracujá Sabor a Fruta',width:1106,height:1422,fit:'contain'},
  {name:'Manga',description:'Suave, cremosa e irresistivelmente tropical.',image:'assets/images/manga.jpg',alt:'Manga madura, fruta usada para identificar este sabor',width:800,height:600,fit:'cover'}
];

const productCarousel=document.querySelector('[data-product-carousel]');
if(productCarousel&&showcaseProducts.length){
  const viewport=productCarousel.querySelector('[data-product-viewport]');
  const track=productCarousel.querySelector('[data-product-track]');
  const dots=productCarousel.querySelector('[data-product-dots]');
  const count=productCarousel.querySelector('[data-product-count]');
  let activeIndex=0;
  let scrollFrame=0;
  const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  track.innerHTML=showcaseProducts.map((product,index)=>{
    const picture=product.webp
      ? `<picture class="image-source"><source srcset="${product.webp}" type="image/webp"><img src="${product.image}" alt="${product.alt}" width="${product.width}" height="${product.height}" loading="lazy" decoding="async" style="object-fit:${product.fit}"></picture>`
      : `<img src="${product.image}" alt="${product.alt}" width="${product.width}" height="${product.height}" loading="lazy" decoding="async" style="object-fit:${product.fit}">`;
    const badge=product.name==='Maracujá'?'EMBALAGEM DO PRODUTO':'SABOR DE FRUTA';
    return `<article class="product-card product-carousel-card${product.fit==='contain'?' product-carousel-package':''}" data-product-slide aria-label="${product.name}">
      <div class="product-image product-carousel-image"><span class="product-index">${badge}</span>${picture}<span class="product-slide-index">${String(index+1).padStart(2,'0')}</span></div>
      <div class="product-meta"><h3>${product.name}</h3><p>${product.description}</p></div>
    </article>`;
  }).join('');

  const slides=[...track.querySelectorAll('[data-product-slide]')];
  dots.innerHTML=showcaseProducts.map((product,index)=>`<button class="product-carousel-dot" type="button" data-product-dot aria-label="Mostrar ${product.name}" aria-pressed="false"></button>`).join('');
  const dotButtons=[...dots.querySelectorAll('[data-product-dot]')];
  const setGutters=()=>{
    const side=Math.max(16,(viewport.clientWidth-slides[0].clientWidth)/2);
    track.style.paddingInline=`${side}px`;
  };
  const setActive=(index,scrollToSlide=false)=>{
    activeIndex=(index+slides.length)%slides.length;
    slides.forEach((slide,slideIndex)=>{
      slide.classList.toggle('is-active',slideIndex===activeIndex);
      slide.classList.toggle('is-before',slideIndex===(activeIndex-1+slides.length)%slides.length);
      slide.classList.toggle('is-after',slideIndex===(activeIndex+1)%slides.length);
    });
    dotButtons.forEach((dot,dotIndex)=>{
      const selected=dotIndex===activeIndex;
      dot.setAttribute('aria-pressed',String(selected));
    });
    count.textContent=`${String(activeIndex+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    if(scrollToSlide){
      const slide=slides[activeIndex];
      const left=slide.offsetLeft-(viewport.clientWidth-slide.clientWidth)/2;
      viewport.scrollTo({left,behavior:prefersReducedMotion?'auto':'smooth'});
    }
  };
  const findCenteredSlide=()=>{
    const center=viewport.scrollLeft+viewport.clientWidth/2;
    let nearest=0;
    let distance=Infinity;
    slides.forEach((slide,index)=>{
      const slideCenter=slide.offsetLeft+slide.clientWidth/2;
      const candidate=Math.abs(center-slideCenter);
      if(candidate<distance){distance=candidate;nearest=index;}
    });
    if(nearest!==activeIndex)setActive(nearest);
  };
  const moveBy=(step)=>setActive(activeIndex+step,true);

  productCarousel.querySelector('[data-product-prev]').addEventListener('click',()=>moveBy(-1));
  productCarousel.querySelector('[data-product-next]').addEventListener('click',()=>moveBy(1));
  dotButtons.forEach((dot,index)=>dot.addEventListener('click',()=>setActive(index,true)));
  slides.forEach((slide,index)=>slide.addEventListener('click',()=>{if(index!==activeIndex)setActive(index,true);}));
  viewport.addEventListener('scroll',()=>{
    if(scrollFrame)return;
    scrollFrame=requestAnimationFrame(()=>{findCenteredSlide();scrollFrame=0;});
  },{passive:true});
  viewport.addEventListener('keydown',(event)=>{
    if(event.key==='ArrowRight'){event.preventDefault();moveBy(1);}
    if(event.key==='ArrowLeft'){event.preventDefault();moveBy(-1);}
  });
  const resizeObserver=new ResizeObserver(()=>{
    setGutters();
    const slide=slides[activeIndex];
    viewport.scrollLeft=slide.offsetLeft-(viewport.clientWidth-slide.clientWidth)/2;
  });
  resizeObserver.observe(viewport);
  setGutters();
  setActive(0);
}

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
