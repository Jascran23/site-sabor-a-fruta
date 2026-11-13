// Preencha com o Place ID do perfil e uma chave da Maps JavaScript API restrita
// ao domínio do site. O carregamento só ocorre após clique em "Carregar avaliações".
const GOOGLE_REVIEWS_CONFIG = {
  apiKey: '',
  placeId: 'ChIJv7t5uWdVsgcRMcfuaq-TRAU',
  mapsUrl: 'https://www.google.com/maps/place/Saborafruta+-+Polpas+de+Frutas/@-5.8234493,-35.2996566,13z/data=!4m10!1m2!2m1!1sSabor+a+Fruta+Natal+RN!3m6!1s0x7b25544ceab5509:0xcf007200d6441291!8m2!3d-5.8234493!4d-35.2234389!15sChZTYWJvciBhIEZydXRhIE5hdGFsIFJOWhgiFnNhYm9yIGEgZnJ1dGEgbmF0YWwgcm6SARFmcm96ZW5fZm9vZF9zdG9yZZoBRENpOURRVWxSUVVOdlpFTm9kSGxqUmpsdlQyMUdSR0pGZEVkaU1IaFJZbFpWTW1Nd01VVlJibEo1V2xkYWVGbHJSUkFC4AEA-gEECAAQLw!16s%2Fg%2F11xw177fqw?entry=ttu&g_ep=EgoyMDI2MTEwOC4wIKXMDSoASAFQAw%3D%3D'
};

const reviewsSection = document.querySelector('[data-google-reviews]');

if (reviewsSection) {
  const loadButton = reviewsSection.querySelector('[data-reviews-load]');
  const status = reviewsSection.querySelector('[data-reviews-status]');
  const reviewsList = reviewsSection.querySelector('[data-reviews-list]');
  const summary = reviewsSection.querySelector('[data-reviews-summary]');
  const mapElement = reviewsSection.querySelector('[data-reviews-map]');
  const placeholder = reviewsSection.querySelector('[data-reviews-placeholder]');
  const mapsLink = reviewsSection.querySelector('[data-reviews-link]');
  let mapsLibraryPromise;

  if (GOOGLE_REVIEWS_CONFIG.mapsUrl) mapsLink.href = GOOGLE_REVIEWS_CONFIG.mapsUrl;
  loadButton.disabled = !(GOOGLE_REVIEWS_CONFIG.apiKey && GOOGLE_REVIEWS_CONFIG.placeId);

  if (!loadButton.disabled) {
    status.textContent = 'Veja a nota geral e as avaliações públicas do perfil da Sabor a Fruta.';
  }

  function loadMapsLibraries() {
    if (mapsLibraryPromise) return mapsLibraryPromise;

    mapsLibraryPromise = new Promise((resolve, reject) => {
      const callbackName = '__saborFrutaMapsReady';
      window[callbackName] = () => resolve();
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_REVIEWS_CONFIG.apiKey)}&loading=async&callback=${callbackName}&v=weekly`;
      script.async = true;
      script.onerror = () => reject(new Error('Não foi possível carregar o Google Maps.'));
      document.head.append(script);
    }).then(async () => {
      const [maps, places] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('places')
      ]);
      return { maps, places };
    });

    return mapsLibraryPromise;
  }

  function renderReview(review) {
    const card = document.createElement('article');
    card.className = 'google-review-card';

    const rating = document.createElement('div');
    rating.className = 'google-reviews-stars';
    rating.textContent = `${'★'.repeat(Math.max(0, Math.min(5, Math.round(review.rating || 0))))}${'☆'.repeat(5 - Math.max(0, Math.min(5, Math.round(review.rating || 0))))}`;
    rating.setAttribute('aria-label', `Nota ${review.rating || 0} de 5`);
    card.append(rating);

    if (review.text?.text) {
      const text = document.createElement('p');
      text.textContent = review.text.text;
      card.append(text);
    }

    const attribution = review.authorAttribution;
    if (attribution?.displayName) {
      const author = attribution.uri ? document.createElement('a') : document.createElement('span');
      author.className = 'google-review-author';
      author.textContent = attribution.displayName;
      if (attribution.uri) {
        author.href = attribution.uri;
        author.target = '_blank';
        author.rel = 'noreferrer';
      }
      card.append(author);
    }

    if (review.relativePublishTimeDescription) {
      const date = document.createElement('span');
      date.className = 'google-review-date';
      date.textContent = review.relativePublishTimeDescription;
      card.append(date);
    }

    return card;
  }

  loadButton.addEventListener('click', async () => {
    loadButton.disabled = true;
    status.textContent = 'Carregando avaliações do Google…';
    reviewsList.replaceChildren();

    try {
      const { maps, places } = await loadMapsLibraries();
      const place = new places.Place({ id: GOOGLE_REVIEWS_CONFIG.placeId });
      await place.fetchFields({ fields: ['displayName', 'location', 'rating', 'userRatingCount', 'reviews'] });

      if (place.location) {
        mapElement.hidden = false;
        const map = new maps.Map(mapElement, {
          center: place.location,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true
        });
        new maps.Marker({ map, position: place.location, title: place.displayName || 'Sabor a Fruta' });
      }

      const score = Number(place.rating || 0);
      const ratingLabel = document.createElement('span');
      ratingLabel.className = 'google-reviews-rating';
      ratingLabel.textContent = score ? score.toFixed(1).replace('.', ',') : '—';
      const stars = document.createElement('span');
      stars.className = 'google-reviews-stars';
      stars.textContent = `${'★'.repeat(Math.round(score))}${'☆'.repeat(5 - Math.round(score))}`;
      const count = document.createElement('span');
      count.className = 'google-reviews-count';
      count.textContent = `${place.userRatingCount || 0} avaliações públicas no Google`;
      summary.replaceChildren(ratingLabel, document.createTextNode(' '), stars, count);
      summary.hidden = false;
      placeholder.hidden = true;

      (place.reviews || []).forEach(review => reviewsList.append(renderReview(review)));
      if (!place.reviews?.length) {
        const empty = document.createElement('p');
        empty.className = 'google-review-error';
        empty.textContent = 'Ainda não há avaliações disponíveis para exibir.';
        reviewsList.append(empty);
      }

      status.textContent = `Avaliações públicas de ${place.displayName || 'Sabor a Fruta'}, fornecidas pelo Google.`;
      if (place.googleMapsURI) mapsLink.href = place.googleMapsURI;
      reviewsSection.dataset.loaded = 'true';
    } catch (error) {
      status.textContent = 'Não foi possível carregar as avaliações. Confira a chave da API, o Place ID e as restrições da conta Google Maps Platform.';
      loadButton.disabled = false;
      console.error('[Google Reviews]', error);
    }
  });
}
