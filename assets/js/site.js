/* Castle — site.js
   Nav state, mobile menu, scroll reveals, manifesto word-reveal,
   marquee duplication, Unicorn Studio (WebGL scenes) bootstrap. */

(function () {
  'use strict';

  /* ----- Mobile menu ----- */
  var burger = document.querySelector('.nav-burger');
  var menu = document.querySelector('.mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        burger.classList.remove('open');
      }
    });
  }

  /* ----- Scroll-in reveals (rise + fade, staggered within card groups) -----
     .reveal can be set in the HTML; common card/heading elements get it
     automatically so every page animates without per-file markup. */
  ['.feature-card', '.blog-card', '.team-card', '.section-header'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.classList.add('reveal'); });
  });

  // stagger: delay each element by its index among reveal-siblings
  document.querySelectorAll('.reveal').forEach(function (el) {
    var siblings = el.parentElement ? [].filter.call(el.parentElement.children, function (c) {
      return c.classList.contains('reveal');
    }) : [el];
    var i = siblings.indexOf(el);
    if (i > 0) el.style.transitionDelay = (i * 0.12) + 's';
  });

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ----- Manifesto: word-by-word reveal tied to scroll ----- */
  var blocks = document.querySelectorAll('.manifesto-block');
  if (blocks.length) {
    blocks.forEach(function (block) {
      var words = block.textContent.trim().split(/\s+/);
      block.textContent = '';
      words.forEach(function (word, i) {
        var span = document.createElement('span');
        span.className = 'w';
        span.textContent = word;
        block.appendChild(span);
        if (i < words.length - 1) block.appendChild(document.createTextNode(' '));
      });
    });

    var updateReveal = function () {
      var vh = window.innerHeight;
      blocks.forEach(function (block) {
        var r = block.getBoundingClientRect();
        // 0 when block top is at 88% of viewport, 1 when at 38%
        var progress = (vh * 0.88 - r.top) / (vh * 0.5);
        progress = Math.max(0, Math.min(1, progress));
        var words = block.querySelectorAll('.w');
        var lit = Math.round(progress * words.length);
        words.forEach(function (w, i) { w.classList.toggle('lit', i < lit); });
      });
    };
    window.addEventListener('scroll', updateReveal, { passive: true });
    window.addEventListener('resize', updateReveal);
    updateReveal();
  }

  /* ----- Marquee: duplicate track content for a seamless loop ----- */
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    track.innerHTML += track.innerHTML;
    track.setAttribute('aria-hidden', 'false');
  });

  /* ----- Unicorn Studio scenes (WebGL backgrounds) ----- */
  if (document.querySelector('[data-us-project],[data-us-project-src]')) {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.9/dist/unicornStudio.umd.js';
    s.async = true;
    s.onload = function () {
      if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
        window.UnicornStudio.init();
        window.UnicornStudio.isInitialized = true;
      }
    };
    document.head.appendChild(s);
  }
})();
