/* ==========================================================================
   Main Controller & Interactions - Brunelli Joias
   ========================================================================== */


  // ==========================================================================
  // 1. Live Countdown Timer (00 Dia : 05 Hora : 52 Min : 59 Seg)
  // ==========================================================================
  function initCountdown() {
    let targetTime = Date.now() + (5 * 3600 + 52 * 60 + 59) * 1000;

    function update() {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n) => String(n).padStart(2, '0');

      const dEl = document.getElementById('timer-days');
      const hEl = document.getElementById('timer-hours');
      const mEl = document.getElementById('timer-mins');
      const sEl = document.getElementById('timer-secs');

      if (dEl) dEl.textContent = pad(days);
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(mins);
      if (sEl) sEl.textContent = pad(secs);
    }

    update();
    setInterval(update, 1000);
  }

  // ==========================================================================
  // 2. Category Filter Selection (Circles)
  // ==========================================================================
  window.filterByCategory = function(categoryName) {
    const buttons = document.querySelectorAll('.category-circle-item');
    buttons.forEach(b => {
      if (b.getAttribute('data-cat') === categoryName) {
        b.classList.add('selected');
      } else {
        b.classList.remove('selected');
      }
    });

    window.showToast(`Visualizando peças exclusivas: ${categoryName}`);
    
    // Mapeamento de categorias para os IDs das seções
    const targetMap = {
      'MASCULINO': 'masculino',
      'PULSEIRA FEMININA': 'pulseira-feminina',
      'PULSEIRA FEM.': 'pulseira-feminina',
      'PIERCINGS': 'piercings',
      'ANÉIS': 'aneis',
      'PULSEIRA BERLOQUE/CHARMS': 'berloques',
      'BRINCO ARGOLAS': 'argolas',
      'BRINCOS TARRACHAS': 'tarrachas',
      'CONJUNTO': 'conjunto',
      'COLARES': 'colares'
    };
    
    const targetId = targetMap[categoryName];
    if (targetId) {
      const showcase = document.getElementById(targetId);
      if (showcase) showcase.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ==========================================================================
  // 3. Search Bar Handler
  // ==========================================================================
  window.handleSearch = function() {
    const overlay = document.getElementById('search-overlay-panel');
    const input = document.getElementById('custom-search-input');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (input) setTimeout(() => input.focus(), 300);
    }
  };

  window.closeSearchOverlay = function() {
    const overlay = document.getElementById('search-overlay-panel');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.executeSearch = function() {
    const input = document.getElementById('custom-search-input');
    if (input && input.value.trim() !== "") {
      window.closeSearchOverlay();
      window.showToast(`Buscando joias por: "${input.value.trim()}"...`);
      const showcase = document.getElementById('categorias');
      if (showcase) showcase.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ==========================================================================
  // 4. Mobile Menu Navigation Toggle
  // ==========================================================================
  window.toggleMobileMenu = function() {
    const nav = document.querySelector('.categories-nav-bar');
    if (nav) {
      nav.classList.toggle('active');
    }
  };

  // ==========================================================================
  // 5. Toast Hub
  // ==========================================================================
  window.showToast = function(message) {
    // Notificações desativadas a pedido do usuário
  };

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
  });

function initScrollIndicators() {
  const containers = document.querySelectorAll('.products-grid-container');
  containers.forEach(container => {
    const checkScroll = () => {
      if (window.innerWidth >= 1024) return;
      const existing = container.parentNode.querySelector('.scroll-indicators');
      if (existing) existing.remove();
      
      if (container.scrollWidth > container.clientWidth + 10) {
        const wrapper = document.createElement('div');
        wrapper.className = 'scroll-indicators';
        
        const numItems = container.children.length;
        const itemsPerPage = 2; 
        const numDots = Math.ceil(numItems / itemsPerPage) + (numItems % 2 !== 0 ? 1 : 0);
        const finalDots = numDots > 1 ? numDots : 2; // At least 2 dots if it scrolls
        
        for(let i=0; i<finalDots; i++) {
          const dot = document.createElement('div');
          dot.className = 'scroll-dot' + (i === 0 ? ' active' : '');
          wrapper.appendChild(dot);
        }
        
        container.parentNode.insertBefore(wrapper, container.nextSibling);
        
        container.addEventListener('scroll', () => {
          const maxScroll = container.scrollWidth - container.clientWidth;
          const scrollPercent = maxScroll > 0 ? (container.scrollLeft / maxScroll) : 0;
          
          const dots = wrapper.querySelectorAll('.scroll-dot');
          dots.forEach(d => d.classList.remove('active'));
          
          let activeIndex = Math.round(scrollPercent * (dots.length - 1));
          if (activeIndex >= dots.length) activeIndex = dots.length - 1;
          if (dots[activeIndex]) dots[activeIndex].classList.add('active');
        });
      }
    };
    
    setTimeout(checkScroll, 500);
    window.addEventListener('resize', () => {
      setTimeout(checkScroll, 300);
    });
  });
}
document.addEventListener('DOMContentLoaded', initScrollIndicators);

// ==========================================================================
// Hero Slider - Slide lateral com bolinhas e touch/swipe
// ==========================================================================
function initHeroSlider() {
  const track = document.getElementById('hero-track');
  const dotsContainer = document.getElementById('hero-dots');
  if (!track || !dotsContainer) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const dots = dotsContainer.querySelectorAll('.dot');
  let current = 0;
  let autoplay;
  let touchStartX = 0;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }

  // Bolinhas clicáveis
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); restartAuto(); }));

  // Autoplay a cada 5s
  function startAuto() { autoplay = setInterval(next, 5000); }
  function restartAuto() { clearInterval(autoplay); startAuto(); }
  startAuto();

  // Swipe touch (mobile)
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); restartAuto(); }
  });
}
document.addEventListener('DOMContentLoaded', initHeroSlider);


// Scroll dots functionality
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainers = document.querySelectorAll('.scroll-container');
    
    scrollContainers.forEach(container => {
        const dotsContainer = container.nextElementSibling;
        if (!dotsContainer || !dotsContainer.classList.contains('scroll-dots')) return;
        
        const items = container.children;
        const numItems = items.length;
        
        // Create dots
        dotsContainer.innerHTML = '';
        for (let i = 0; i < numItems; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                items[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            });
            dotsContainer.appendChild(dot);
        }
        
        const dots = dotsContainer.querySelectorAll('.dot');
        
        // Update dots on scroll
        container.addEventListener('scroll', () => {
            let index = Math.round(container.scrollLeft / items[0].offsetWidth);
            if (index >= numItems) index = numItems - 1;
            
            dots.forEach(d => d.classList.remove('active'));
            if(dots[index]) dots[index].classList.add('active');
        });
        
        // Drag to scroll for PC
        let isDown = false;
        let startX;
        let scrollLeft;
        
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
            container.style.scrollSnapType = 'none'; // Disable snapping while dragging
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.style.scrollBehavior = 'smooth';
            container.style.scrollSnapType = 'x mandatory';
        });
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.style.scrollBehavior = 'smooth';
            container.style.scrollSnapType = 'x mandatory';
            // Snap to nearest
            const index = Math.round(container.scrollLeft / items[0].offsetWidth);
            if (items[index]) {
                items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }
        });
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // scroll-fast
            container.scrollLeft = scrollLeft - walk;
        });
    });
});
