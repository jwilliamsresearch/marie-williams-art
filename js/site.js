/* Marie Williams — site behaviour: menu, scroll reveals, lightbox. */
(function () {
  'use strict';

  var body = document.body;

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('navPanel');

  function setMenu(open) {
    if (!toggle || !panel) return;
    panel.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    body.classList.toggle('is-locked', open);
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setMenu(false);
    });
  }

  /* ---------- Scroll reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var frames = document.querySelectorAll('.plate__frame');
  if (!lightbox || !frames.length) return;

  var stageImg = document.getElementById('changeImage');
  var counter = document.getElementById('lbCount');
  var lastFocus = null;
  var current = 0;

  var sources = Array.prototype.map.call(frames, function (btn) {
    return btn.querySelector('img').getAttribute('src');
  });

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function show(index) {
    current = (index + sources.length) % sources.length;
    stageImg.style.animation = 'none';
    /* force reflow so the fade-in replays on every change */
    void stageImg.offsetWidth;
    stageImg.style.animation = '';
    stageImg.src = sources[current];
    if (counter) counter.textContent = pad(current + 1) + ' / ' + pad(sources.length);
  }

  function openLightbox(index) {
    lastFocus = document.activeElement;
    show(index);
    lightbox.classList.add('is-open');
    body.classList.add('is-locked');
    var close = lightbox.querySelector('[data-lb="close"]');
    if (close) close.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    body.classList.remove('is-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  Array.prototype.forEach.call(frames, function (btn) {
    btn.addEventListener('click', function () {
      openLightbox(parseInt(btn.getAttribute('data-index'), 10) || 0);
    });
  });

  lightbox.addEventListener('click', function (e) {
    var action = e.target.getAttribute && e.target.getAttribute('data-lb');
    if (action === 'close') closeLightbox();
    else if (action === 'prev') show(current - 1);
    else if (action === 'next') show(current + 1);
    else if (e.target === lightbox || e.target.className === 'lightbox__stage') closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
}());
