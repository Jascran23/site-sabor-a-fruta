// Mantenha image como null ate haver um recorte correspondente da embalagem. As artes do Instagram tem fundo incorporado; manga.jpg mostra apenas a fruta e nao ha foto de embalagem de caja.
const products = [
  { name: 'Goiaba', image: null, description: 'Doce, perfumada e cheia de personalidade. Um sabor familiar para uma pausa refrescante e receitas para compartilhar.', profile: 'CLÁSSICO' },
  { name: 'Abacaxi', image: null, description: 'Levemente ácido, naturalmente doce e muito refrescante. Um toque tropical para sucos e combinações.', profile: 'TROPICAL' },
  { name: 'Caju', image: null, description: 'Um sabor marcante e genuinamente brasileiro, equilibrando doçura e acidez numa polpa cheia de presença.', profile: 'BRASILIDADE' },
  { name: 'Maracujá', image: 'assets/images/polpa-maracuja.png', transparent: true, description: 'Aroma que chega primeiro, sabor que fica. Tem acidez vibrante e vai bem em sucos, sobremesas e outras ideias gostosas.', profile: 'INTENSO' },
  { name: 'Cajá', image: null, description: 'Pequeno no tamanho, grande no sabor. Um perfil tropical vivo e azedinho para quem gosta de sabores surpreendentes.', profile: 'MARCANTE' },
  { name: 'Manga', image: null, description: 'Doçura envolvente e textura aveludada para bebidas cremosas e um toque frutado na rotina.', profile: 'SUAVE' }
];

const list = document.querySelector('#flavor-list');
const productImageMarkup = (product) => product.image
  ? `<picture class="flavor-picture"><source srcset="assets/images/optimized-polpa-maracuja-800.webp" type="image/webp"><img class="flavor-product${product.transparent ? ' is-cutout' : ''}" src="${product.image}" alt="Embalagem da polpa de ${product.name}" width="1106" height="1422" loading="lazy" decoding="async"></picture>`
  : '';

list.innerHTML = products.map((product, index) => {
  const side = index % 2 === 0 ? 'left' : 'right';
  const count = String(index + 1).padStart(2, '0');
  const copy = `<div class="flavor-copy">
    <span class="flavor-count">SABOR ${count} <i>—</i> ${product.profile}</span>
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <div class="flavor-tags"><span>100% NATURAL</span><span>SEM ADIÇÃO DE AÇÚCAR</span></div>
    <a href="https://instagram.com/saborafruta" target="_blank" rel="noreferrer">SAIBA MAIS <b>↗</b></a>
  </div>`;
  return `<article class="flavor-row flavor-${side}${product.image ? '' : ' flavor-no-image'}" data-fruit="${product.name.toLowerCase()}">
    ${side === 'left' ? copy + productImageMarkup(product) : productImageMarkup(product) + copy}
  </article>`;
}).join('');

document.querySelector('#year').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsap = window.gsap;
if (gsap && window.ScrollTrigger && !reducedMotion) {
  gsap.registerPlugin(window.ScrollTrigger);
  gsap.utils.toArray('.flavor-row').forEach((row) => {
    const left = row.classList.contains('flavor-left');
    const copy = row.querySelector('.flavor-copy');
    const image = row.querySelector('.flavor-product');
    gsap.fromTo(copy, { autoAlpha: 0, x: left ? -48 : 48, y: 18 }, { autoAlpha: 1, x: 0, y: 0, ease: 'none', scrollTrigger: { trigger: row, start: 'top 61%', end: 'top 25%', scrub: .8, invalidateOnRefresh: true } });
    if (image) gsap.fromTo(image, { autoAlpha: 0, x: left ? 48 : -48, y: 24, scale: .95 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: row, start: 'top 61%', end: 'top 25%', scrub: .8, invalidateOnRefresh: true } });
  });
  gsap.fromTo('.track-progress', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.flavor-timeline', start: 'top 42%', end: 'bottom 18%', scrub: .8, invalidateOnRefresh: true } });
  gsap.fromTo('.timeline-hero h1', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .8, ease: 'power2.out', delay: .1 });
  gsap.fromTo('.timeline-hero>p:not(.timeline-kicker)', { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: .65, ease: 'power2.out', delay: .25 });
  window.addEventListener('load', () => window.ScrollTrigger.refresh(), { once: true });
} else {
  document.querySelectorAll('.flavor-row').forEach((row) => row.classList.add('is-visible'));
  document.querySelector('.track-progress').style.transform = 'scaleY(1)';
}
