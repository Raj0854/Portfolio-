(function(){
  "use strict";

  var hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Preloader ---------- */
  window.addEventListener('load', function(){
    setTimeout(function(){
      var pre = document.getElementById('preloader');
      pre.classList.add('is-hidden');
    }, 700);
  });

  /* ---------- Custom cursor ---------- */
  if (hasFinePointer && !reducedMotion){
    document.body.classList.add('has-cursor');
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    var rx = 0, ry = 0, dx = 0, dy = 0;

    window.addEventListener('mousemove', function(e){
      dx = e.clientX; dy = e.clientY;
      dot.style.left = dx + 'px';
      dot.style.top = dy + 'px';
    });

    function animateRing(){
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .skill-card, .project-card, input, textarea').forEach(function(el){
      el.addEventListener('mouseenter', function(){ ring.classList.add('is-active'); });
      el.addEventListener('mouseleave', function(){ ring.classList.remove('is-active'); });
    });
  }

  /* ---------- Navbar scroll state ---------- */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function(){
    navbar.classList.toggle('is-scrolled', window.scrollY > 30);

    var backToTop = document.getElementById('backToTop');
    backToTop.style.opacity = window.scrollY > 500 ? '1' : '0.35';
  }, { passive:true });

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  navToggle.addEventListener('click', function(){
    navToggle.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open');
  });
  mobileMenu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      navToggle.classList.remove('is-open');
      mobileMenu.classList.remove('is-open');
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------- Counter animation ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var countersDone = false;
  function runCounters(){
    if (countersDone) return;
    countersDone = true;
    counters.forEach(function(el){
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var current = 0;
      var step = Math.max(1, Math.round(target / 40));
      var timer = setInterval(function(){
        current += step;
        if (current >= target){
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + suffix;
      }, 30);
    });
  }
  var statRow = document.querySelector('.stat-row');
  if (statRow && 'IntersectionObserver' in window){
    var statObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          runCounters();
          statObserver.disconnect();
        }
      });
    }, { threshold:0.4 });
    statObserver.observe(statRow);
  } else {
    runCounters();
  }

  /* ---------- 3D tilt: ID card, skill cards, project cards ---------- */
  if (hasFinePointer && !reducedMotion){
    var tiltTargets = document.querySelectorAll('#idCard, .skill-card, .project-card');
    tiltTargets.forEach(function(card){
      var bounds;
      card.addEventListener('mouseenter', function(){
        bounds = card.getBoundingClientRect();
      });
      card.addEventListener('mousemove', function(e){
        if (!bounds) bounds = card.getBoundingClientRect();
        var px = (e.clientX - bounds.left) / bounds.width;
        var py = (e.clientY - bounds.top) / bounds.height;
        var rotateY = (px - 0.5) * 16;
        var rotateX = (0.5 - py) * 16;
        card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(0)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
      });
    });
  }

  /* ---------- Testimonial carousel ---------- */
  var track = document.getElementById('testTrack');
  var cards = track ? track.children.length : 0;
  var perView = 3;
  var index = 0;

  function getPerView(){
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateTrack(){
    perView = getPerView();
    var maxIndex = Math.max(0, cards - perView);
    if (index > maxIndex) index = maxIndex;
    var pct = (100 / cards) * index;
    track.style.transform = 'translateX(-' + pct + '%)';
  }

  document.getElementById('testNext').addEventListener('click', function(){
    var maxIndex = Math.max(0, cards - perView);
    index = Math.min(maxIndex, index + 1);
    updateTrack();
  });
  document.getElementById('testPrev').addEventListener('click', function(){
    index = Math.max(0, index - 1);
    updateTrack();
  });
  window.addEventListener('resize', updateTrack);
  updateTrack();

  /* ---------- Contact form (demo only — no backend) ---------- */
  var form = document.getElementById('contactForm');
  var toast = document.getElementById('toast');
  var toastText = document.getElementById('toastText');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('cf-name').value.trim();
    toastText.textContent = name ? ('Thanks, ' + name + ' — message sent!') : 'Message sent — I\'ll reply soon!';
    toast.classList.add('is-visible');
    form.reset();
    setTimeout(function(){ toast.classList.remove('is-visible'); }, 3200);
  });

  /* ---------- Back to top ---------- */
  document.getElementById('backToTop').addEventListener('click', function(){
    window.scrollTo({ top:0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });

})();