(function () {
  'use strict';

  var P = window.PROFILE || {};
  var PROJECTS = window.PROJECTS || [];
  var CATS = window.CATEGORIES || [];
  var catLabel = {};
  CATS.forEach(function (c) { catLabel[c.id] = c.label; });

  var ICONS = {
    rail: '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l-2-4M15 21l2-4"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M10.8 12.2 20 3M17 6l2 2M15 8l2 2"/>',
    voice: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4"/>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    record: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    menu: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h6M7 13h10M7 17h4"/>',
    user: '<circle cx="12" cy="9" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    pointer: '<path d="m5 3 14 7-6 2-2 6z"/><path d="m13 12 6 6"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13v1M15 13v1M2 13v3M22 13v3"/>',
  };
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function isLive(p) { return /продакшен|живом/i.test(p.status || ''); }
  function statusHtml(p) {
    if (!p.status) return '';
    var cls = isLive(p) ? ' status--live' : /готово/i.test(p.status) ? ' status--done' : '';
    return '<span class="status' + cls + '">' + esc(p.status) + '</span>';
  }
  function chips(list) {
    return '<div class="chips">' + (list || []).map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') + '</div>';
  }
  function tag(p) { return '<span class="tag">' + esc(catLabel[p.category] || '') + '</span>'; }

  /* ---------- profile bindings ---------- */
  document.querySelectorAll('[data-bind]').forEach(function (el) {
    var v = P[el.getAttribute('data-bind')];
    if (v) el.textContent = v;
  });
  if (P.name) document.title = P.name + ' — портфолио';
  var pulse = document.querySelector('[data-available]');
  if (pulse && !P.available) pulse.hidden = true;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- stats ---------- */
  var tech = {};
  PROJECTS.forEach(function (p) { (p.stack || []).forEach(function (s) { tech[s.replace(/\s*\d+(\.\d+)?$/, '')] = 1; }); });
  var setStat = function (k, v) { var el = document.querySelector('[data-stat="' + k + '"]'); if (el) el.textContent = v; };
  setStat('projects', PROJECTS.length);
  setStat('live', PROJECTS.filter(isLive).length);
  setStat('tech', Object.keys(tech).length + '+');

  /* ---------- featured ---------- */
  function visual(p) {
    if (p.visual === 'screenshot') {
      return '<div class="feat__visual feat__visual--screenshot">' +
        '<picture><source srcset="' + esc(p.image) + '" type="image/webp">' +
        '<img class="shot" src="' + esc(p.imageFallback || p.image) + '" alt="Интерфейс ' + esc(p.title) + '" loading="lazy" width="1484" height="855"></picture></div>';
    }
    if (p.visual === 'flow') {
      return '<div class="feat__visual" aria-hidden="true"><div class="flow">' +
        '<div class="flow__row"><div class="flow__node"><b>Игрок</b>!donate → оплата</div><span class="flow__arrow">→</span>' +
        '<div class="flow__node flow__node--hot"><b>Бэкенд</b>заказ в очередь</div></div>' +
        '<div class="flow__row"><div class="flow__node"><b>Сервер</b>опрос · 10 с</div><span class="flow__arrow">→</span>' +
        '<div class="flow__node"><b>ULX</b>ранг выдан ✓</div></div>' +
        '<div class="flow__alert">🚨 нет отчёта 5 мин → Telegram</div>' +
        '</div></div>';
    }
    if (p.visual === 'loading') {
      return '<div class="feat__visual" aria-hidden="true"><div class="ls-wrap"><div class="ls">' +
        '<div class="ls__logo">M</div><div><div class="ls__name">MetroPlus Project</div><div class="ls__meta">gm_metro_crossline · 42 / 64</div></div>' +
        '<div class="ls__bottom"><div class="ls__row"><span>Загрузка ресурсов…</span><span>♪ now playing</span></div><div class="ls__bar"><span></span></div></div>' +
        '</div><div class="ls__url">sv_loadingurl "hj331.gscreen.io"</div></div></div>';
    }
    return '';
  }

  var featuredEl = document.getElementById('featured');
  featuredEl.innerHTML = PROJECTS.filter(function (p) { return p.featured; }).map(function (p) {
    return '<article class="feat" data-cat="' + esc(p.category) + '" data-open="' + esc(p.id) + '">' +
      visual(p) +
      '<div class="feat__body">' +
        '<div class="feat__top">' + tag(p) + statusHtml(p) + '</div>' +
        '<h3 class="feat__title">' + esc(p.title) + '</h3>' +
        '<p class="feat__summary">' + esc(p.summary) + '</p>' +
        '<ul class="feat__points">' + (p.highlights || []).slice(0, 3).map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' +
        '<div class="feat__foot">' + chips((p.stack || []).slice(0, 5)) +
          '<button class="more stretch" type="button" aria-label="Подробнее о ' + esc(p.title) + '">Подробнее ' + ARROW + '</button>' +
        '</div>' +
      '</div></article>';
  }).join('');

  /* ---------- filters + grid ---------- */
  var rest = PROJECTS.filter(function (p) { return !p.featured; });
  var gridEl = document.getElementById('grid');
  var filtersEl = document.getElementById('filters');
  var emptyEl = document.getElementById('empty');
  var current = 'all';

  filtersEl.innerHTML = CATS.map(function (c) {
    var n = c.id === 'all' ? rest.length : rest.filter(function (p) { return p.category === c.id; }).length;
    if (!n) return '';
    return '<button class="filter" role="tab" type="button" data-filter="' + esc(c.id) + '" aria-selected="' + (c.id === current) + '">' +
      esc(c.label) + '<span class="count">' + n + '</span></button>';
  }).join('');

  function card(p, i) {
    return '<article class="card" data-cat="' + esc(p.category) + '" data-open="' + esc(p.id) + '" style="animation-delay:' + (i * 35) + 'ms">' +
      '<div class="card__top"><span class="card__icon"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[p.icon] || ICONS.layers) + '</svg></span>' + statusHtml(p) + '</div>' +
      '<div>' + tag(p) + '<h3 class="card__title" style="margin-top:10px">' + esc(p.title) + '</h3></div>' +
      '<p class="card__summary">' + esc(p.summary) + '</p>' +
      (p.snippet ? '<div class="snippet">' + esc(p.snippet) + '</div>' : '') +
      '<div class="card__foot">' + chips((p.stack || []).slice(0, 3)) +
        '<button class="more stretch" type="button" aria-label="Подробнее о ' + esc(p.title) + '">' + ARROW + '</button></div>' +
      '</article>';
  }

  function renderGrid() {
    var list = rest.filter(function (p) { return current === 'all' || p.category === current; });
    gridEl.innerHTML = list.map(card).join('');
    emptyEl.hidden = list.length > 0;
  }
  filtersEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter]');
    if (!b) return;
    current = b.getAttribute('data-filter');
    filtersEl.querySelectorAll('[data-filter]').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
    renderGrid();
  });
  renderGrid();

  /* ---------- modal ---------- */
  var modal = document.getElementById('modal');
  var body = document.getElementById('modalBody');
  var byId = {};
  PROJECTS.forEach(function (p) { byId[p.id] = p; });

  function openProject(id, push) {
    var p = byId[id];
    if (!p) return;
    modal.setAttribute('data-cat', p.category);
    body.innerHTML =
      '<div class="m__meta">' + tag(p) + statusHtml(p) + '</div>' +
      '<h2 class="m__title" id="modalTitle">' + esc(p.title) + '</h2>' +
      '<p class="m__summary">' + esc(p.summary) + '</p>' +
      (p.details ? '<p class="m__details">' + esc(p.details) + '</p>' : '') +
      (p.image ? '<picture><source srcset="' + esc(p.image) + '" type="image/webp"><img class="m__img" src="' + esc(p.imageFallback || p.image) + '" alt="Интерфейс ' + esc(p.title) + '"></picture>' : '') +
      (p.highlights && p.highlights.length ? '<h3 class="m__h">Что внутри</h3><ul class="m__points">' + p.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' : '') +
      '<h3 class="m__h">Стек</h3><div class="m__chips">' + chips(p.stack) + '</div>' +
      (p.link ? '<div class="m__link"><a class="btn btn--primary" href="' + esc(p.link.href) + '" target="_blank" rel="noopener">' + esc(p.link.label) + ' ' + ARROW + '</a></div>' : '');
    if (typeof modal.showModal === 'function') { if (!modal.open) modal.showModal(); } else { modal.setAttribute('open', ''); }
    modal.scrollTop = 0;
    if (push && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
  }
  function closeModal() {
    if (modal.open) modal.close();
  }
  modal.addEventListener('close', function () {
    if (byId[location.hash.slice(1)]) history.pushState(null, '', location.pathname + location.search);
  });
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-open]');
    if (!el || e.target.closest('a')) return;
    openProject(el.getAttribute('data-open'), true);
  });

  function fromHash() {
    var id = location.hash.slice(1);
    if (byId[id]) openProject(id, false); else closeModal();
  }
  window.addEventListener('popstate', fromHash);
  fromHash();

  /* ---------- contacts ---------- */
  var c = P.contacts || {};
  var links = [];
  if (c.telegram) links.push({ href: 'https://t.me/' + c.telegram.replace(/^@/, ''), label: 'Telegram · @' + c.telegram.replace(/^@/, ''), primary: true });
  if (c.email) links.push({ href: 'mailto:' + c.email, label: c.email });
  if (c.discord) links.push({ href: null, label: 'Discord · ' + c.discord });
  if (links.length) {
    document.getElementById('contact').hidden = false;
    document.getElementById('contacts').innerHTML = links.map(function (l) {
      var cls = 'btn ' + (l.primary ? 'btn--primary' : 'btn--ghost');
      return l.href
        ? '<a class="' + cls + '" href="' + esc(l.href) + '"' + (l.href.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + '>' + esc(l.label) + '</a>'
        : '<span class="' + cls + '">' + esc(l.label) + '</span>';
    }).join('');
  } else {
    document.querySelectorAll('[data-contact-link]').forEach(function (a) { a.hidden = true; });
  }

  /* ---------- theme ---------- */
  var root = document.documentElement;
  document.getElementById('themeToggle').addEventListener('click', function () {
    var cur = root.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    var next = cur === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- nav border on scroll ---------- */
  var nav = document.querySelector('.nav');
  var progress = document.querySelector('.progress');
  var onScroll = function () {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max) : 0);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- FX ---------- */
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // бегущая строка из стека всех проектов
  var mq = document.getElementById('marquee');
  if (mq) {
    var names = Object.keys(tech);
    var line = names.map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('');
    mq.innerHTML = line + line;
  }

  // подсветка карточек за курсором
  var glowSel = '.card, .feat, .area, .skill-group';
  document.querySelectorAll('.area, .skill-group').forEach(function (el) { el.classList.add('glow'); });
  function markGlow() { document.querySelectorAll('.card, .feat').forEach(function (el) { el.classList.add('glow'); }); }
  markGlow();
  filtersEl.addEventListener('click', function () { setTimeout(markGlow, 0); });
  document.addEventListener('pointermove', function (e) {
    var el = e.target.closest && e.target.closest(glowSel);
    if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  // счётчики в статистике
  function countUp(el) {
    var raw = el.textContent, n = parseInt(raw, 10), suffix = raw.replace(/^\d+/, '');
    if (!n || reduce) return;
    var t0 = performance.now(), dur = 1100;
    (function tick(t) {
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(n * e) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }
  setTimeout(function () { document.querySelectorAll('[data-stat]').forEach(countUp); }, 350);

  // появление блоков при прокрутке
  if ('IntersectionObserver' in window && !reduce) {
    root.classList.add('fx');
    var targets = document.querySelectorAll('.section__head, .feat, .area, .skill-group, .contact__card');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) {
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      if (/area|skill-group/.test(el.className)) el.style.setProperty('--d', (sib * 90) + 'ms');
      el.classList.add('reveal');
      io.observe(el);
    });
  }
})();
