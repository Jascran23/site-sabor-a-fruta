(() => {
  const config = window.SABORAFRUTA_ANALYTICS || {};
  const measurementId = typeof config.measurementId === 'string' && /^G-[A-Z0-9]+$/.test(config.measurementId)
    ? config.measurementId
    : '';
  const storageKey = config.consentStorageKey || 'saborafruta-privacy-preferences';
  const settingsLink = document.querySelector('[data-privacy-settings]');
  const gaScriptId = 'saborafruta-ga4';
  if (measurementId) window[`ga-disable-${measurementId}`] = true;
  let savedChoice = readChoice();
  let gaStarted = false;

  function readChoice() {
    if (!measurementId) return null;
    try {
      const choice = JSON.parse(localStorage.getItem(storageKey));
      if (!choice || choice.version !== config.consentVersion || choice.measurementId !== measurementId ||
          typeof choice.analytics !== 'boolean' || !Number.isFinite(choice.expiresAt) || choice.expiresAt <= Date.now()) {
        localStorage.removeItem(storageKey);
        return null;
      }
      return { analytics: choice.analytics === true };
    } catch {
      return null;
    }
  }

  function saveChoice(analytics) {
    if (!measurementId) return;
    savedChoice = { analytics };
    const duration = Number(config.consentDurationDays) || 180;
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        version: config.consentVersion,
        measurementId,
        analytics,
        expiresAt: Date.now() + duration * 24 * 60 * 60 * 1000
      }));
    } catch {
      // A preferência continua aplicada nesta página mesmo se o navegador bloquear o armazenamento.
    }
    applyAnalyticsChoice(analytics);
  }

  function removeAnalyticsCookies() {
    const cookieNames = ['_ga', `_ga_${measurementId.slice(2).replace(/-/g, '_')}`];
    const domains = [location.hostname, `.${location.hostname}`, '.saborafruta.com.br'];
    cookieNames.forEach((name) => domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
    }));
    cookieNames.forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    });
  }

  function startAnalytics() {
    if (!measurementId || gaStarted) return;
    gaStarted = true;
    window[`ga-disable-${measurementId}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    if (!document.getElementById(gaScriptId)) {
      const script = document.createElement('script');
      script.id = gaScriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.append(script);
    }
  }

  function applyAnalyticsChoice(analytics) {
    if (!measurementId) return;
    if (analytics) {
      if (gaStarted) {
        window[`ga-disable-${measurementId}`] = false;
        window.gtag('consent', 'update', { analytics_storage: 'granted' });
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: location.href,
          page_path: `${location.pathname}${location.search}`
        });
      } else {
        startAnalytics();
      }
      return;
    }
    window[`ga-disable-${measurementId}`] = true;
    if (window.gtag && gaStarted) window.gtag('consent', 'update', { analytics_storage: 'denied' });
    removeAnalyticsCookies();
  }

  const banner = document.createElement('aside');
  banner.className = 'privacy-consent-banner';
  banner.id = 'privacy-consent-banner';
  banner.hidden = true;
  banner.setAttribute('aria-labelledby', 'privacy-consent-title');
  banner.setAttribute('aria-live', 'polite');
  banner.innerHTML = `
    <div class="privacy-consent-copy">
      <p class="privacy-consent-kicker">SABOR A FRUTA · PRIVACIDADE</p>
      <h2 id="privacy-consent-title">Você escolhe sobre a medição.</h2>
      <p>Podemos usar o Google Analytics para medir visitas e melhorar o site. A medição só começa se você permitir. Você pode mudar sua escolha depois.</p>
    </div>
    <div class="privacy-consent-actions">
      <button type="button" class="privacy-button privacy-button-primary" data-consent-accept>Aceitar medição</button>
      <button type="button" class="privacy-button" data-consent-reject>Rejeitar medição</button>
      <button type="button" class="privacy-button privacy-button-text" data-consent-configure>Configurar</button>
    </div>`;

  const dialog = document.createElement('dialog');
  dialog.className = 'privacy-preferences';
  dialog.id = 'privacy-preferences';
  dialog.setAttribute('aria-labelledby', 'privacy-preferences-title');
  dialog.innerHTML = `
    <div class="privacy-preferences-head">
      <div><p class="privacy-consent-kicker">SABOR A FRUTA · PRIVACIDADE</p><h2 id="privacy-preferences-title">Preferências de privacidade</h2></div>
      <button type="button" class="privacy-close" data-preferences-close aria-label="Fechar preferências">×</button>
    </div>
    <p class="privacy-preferences-intro">Escolha se autoriza a medição opcional de acessos. Sua escolha fica neste navegador por até ${Number(config.consentDurationDays) || 180} dias e pode ser alterada pelo link de preferências no rodapé.</p>
    <div class="privacy-preference-row"><div><strong>Recursos necessários</strong><p>Permitem carregar e usar o site. Não são usados para análise de audiência.</p></div><span class="privacy-always-on">Sempre ativos</span></div>
    <label class="privacy-preference-row privacy-preference-analytics" for="privacy-analytics-choice"><span><strong>Medição de acessos (Google Analytics 4)</strong><span class="privacy-analytics-description">Registra visitas para gerar estatísticas de uso. Só é carregado após sua autorização.</span></span><input id="privacy-analytics-choice" type="checkbox" data-analytics-choice></label>
    <p class="privacy-ga-unavailable" data-ga-unavailable hidden>O GA4 ainda não foi configurado. Nenhuma medição está ativa e esta opção ficará indisponível até que o ID fornecido pelo cliente seja configurado.</p>
    <div class="privacy-preferences-actions"><button type="button" class="privacy-button privacy-button-primary" data-preferences-save>Salvar escolha</button><button type="button" class="privacy-button" data-preferences-reject>Rejeitar medição</button></div>`;

  document.body.append(banner, dialog);

  const analyticsToggle = dialog.querySelector('[data-analytics-choice]');
  const unavailableMessage = dialog.querySelector('[data-ga-unavailable]');
  const openPreferences = () => {
    analyticsToggle.checked = savedChoice?.analytics === true;
    analyticsToggle.disabled = !measurementId;
    unavailableMessage.hidden = Boolean(measurementId);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };
  const closePreferences = () => {
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
  };
  const choose = (analytics) => {
    saveChoice(analytics);
    banner.hidden = true;
    closePreferences();
  };

  banner.querySelector('[data-consent-accept]').addEventListener('click', () => choose(true));
  banner.querySelector('[data-consent-reject]').addEventListener('click', () => choose(false));
  banner.querySelector('[data-consent-configure]').addEventListener('click', openPreferences);
  dialog.querySelector('[data-preferences-close]').addEventListener('click', closePreferences);
  dialog.querySelector('[data-preferences-save]').addEventListener('click', () => {
    if (measurementId) choose(analyticsToggle.checked);
    else closePreferences();
  });
  dialog.querySelector('[data-preferences-reject]').addEventListener('click', () => {
    if (measurementId) choose(false);
    else closePreferences();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closePreferences();
  });
  settingsLink?.addEventListener('click', (event) => {
    event.preventDefault();
    openPreferences();
  });

  if (measurementId && savedChoice?.analytics) {
    startAnalytics();
  } else if (measurementId && savedChoice?.analytics === false) {
    applyAnalyticsChoice(false);
  } else if (measurementId) {
    banner.hidden = false;
  }
})();
