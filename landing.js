/* ============================================================
   CrowdShield — Landing Page JavaScript
   Incident timeline, scroll animations, death toll counters
   ============================================================ */

(function () {
    'use strict';

    // --- Smooth scroll for hero CTA ---
    const heroCta = document.getElementById('hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.getElementById('incident-timeline');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Incident Data ---
    const incidents = [
        {
            year: 1989, name: 'Hillsborough Disaster', location: 'Sheffield, England',
            deaths: 97, deathDisplay: '97',
            cause: 'Overcrowding in stadium standing pens during FA Cup semi-final',
            image: 'hillsborough.jpg',
            era: 'Early era — sparse monitoring'
        },
        {
            year: 1990, name: 'Hajj Tunnel Stampede', location: 'Mecca',
            deaths: 1426, deathDisplay: '1,426',
            cause: 'Government managed pilgrimage tunnel overcrowding',
            image: 'hajj_tunnel_1990.jpg',
            era: 'Early era — sparse monitoring'
        },
        {
            year: 2001, name: 'Akashi Fireworks Festival', location: 'Hyogo, Japan',
            deaths: 11, deathDisplay: '11',
            cause: 'Municipal fireworks event pedestrian bridge overcrowding',
            image: 'akashi_2001.jpg',
            era: 'Early era — sparse monitoring'
        },
        {
            year: 2003, name: 'The Station Nightclub', location: 'Rhode Island, USA',
            deaths: 100, deathDisplay: '100',
            cause: 'Overcrowding at ticketed concert venue',
            image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1600&q=80',
            era: 'Early era — sparse monitoring'
        },
        {
            year: 2008, name: 'Naina Devi Temple', location: 'Himachal Pradesh, India',
            deaths: 162, deathDisplay: '162',
            cause: 'State managed religious event narrow mountain path',
            image: 'https://utsav.gov.in/public/uploads/darshan_picture/darshan_88/16596128991722914195.jpg',
            era: 'Technology existed. Systems did not.'
        },
        {
            year: 2010, name: 'Love Parade', location: 'Duisburg, Germany',
            deaths: 21, deathDisplay: '21',
            cause: 'City organised festival single entry and exit tunnel',
            image: 'love_parade_2010.jpg',
            era: 'Technology existed. Systems did not.'
        },
        {
            year: 2013, name: 'Kumbh Mela Stampede', location: 'Allahabad, India',
            deaths: 36, deathDisplay: '36',
            cause: 'Government organised largest human gathering train station crush',
            image: 'kumbh_2013.jpg',
            era: 'Technology existed. Systems did not.'
        },
        {
            year: 2015, name: 'Hajj Stampede', location: 'Mina, Saudi Arabia',
            deaths: 2411, deathDisplay: '2,411',
            cause: 'Fully government managed annual event predictable bottleneck',
            image: 'hajj_2015.jpg',
            era: 'Technology existed. Systems did not.'
        },
        {
            year: 2021, name: 'Astroworld Festival', location: 'Houston, USA',
            deaths: 10, deathDisplay: '10',
            cause: 'Ticketed concert crowd compression at stage barrier',
            image: 'astroworld.jpg',
            era: 'Real-time detection was possible. It was not deployed.'
        },
        {
            year: 2024, name: 'Hathras Satsang', location: 'Uttar Pradesh, India',
            deaths: 121, deathDisplay: '121',
            cause: 'Organised religious gathering district administration present',
            image: 'hathras_2024.jpg',
            era: 'Real-time detection was possible. It was not deployed.'
        },
        {
            year: 2025, name: 'Maha Kumbh Mela', location: 'Prayagraj, India',
            deaths: 30, deathDisplay: '30+',
            cause: 'Largest human gathering in history government organised Amrit Snan rush',
            image: 'maha_kumbh_2025.jpg',
            era: 'Real-time detection was possible. It was not deployed.'
        }
    ];

    // --- Generate Incident Cards ---
    const container = document.getElementById('incidents-container');
    if (container) {
        incidents.forEach(function (inc, i) {
            const card = document.createElement('div');
            card.className = 'incident-card';
            card.setAttribute('data-animated', 'false');

            card.innerHTML = `
                <div class="incident-card-bg">
                    <img src="${inc.image}" alt="${inc.name}" loading="lazy">
                    <div class="incident-card-gradient"></div>
                </div>
                <div class="incident-card-content">
                    <div class="incident-top-row">
                        <span class="incident-year">${inc.year}</span>
                        <span class="incident-era">${inc.era}</span>
                    </div>
                    <div class="incident-name">${inc.name}</div>
                    <div class="incident-location">${inc.location}</div>
                    <div class="incident-deaths-row">
                        <span class="incident-death-count" data-target="${inc.deaths}" data-display="${inc.deathDisplay}">0</span>
                        <span class="incident-death-label">DEATHS</span>
                    </div>
                    <div class="incident-cause">${inc.cause}</div>
                    <div class="incident-note">Organised event. Venue management present. No density monitoring in place.</div>
                </div>
            `;

            container.appendChild(card);
        });
    }


    // --- Death Toll Counter Animation ---
    function animateCounter(el, targetVal, displayStr, duration) {
        if (el.dataset.counterRun === 'true') return;
        el.dataset.counterRun = 'true';

        if (targetVal === 0) {
            el.textContent = '0';
            return;
        }

        const start = performance.now();

        function formatNumber(n) {
            return n.toLocaleString('en-US');
        }

        function tick(now) {
            const elapsed = now - start;
            const t = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - t, 2); // easeOut
            const current = Math.round(eased * targetVal);

            if (displayStr.endsWith('+')) {
                el.textContent = formatNumber(current) + '+';
            } else {
                el.textContent = formatNumber(current);
            }

            if (t < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = displayStr;
            }
        }

        requestAnimationFrame(tick);
    }


    // --- Statistics Strip Counter ---
    function animateStatCounter(el, targetVal, suffix, duration) {
        if (el.dataset.counterRun === 'true') return;
        el.dataset.counterRun = 'true';

        if (targetVal === 0) {
            el.textContent = '0';
            return;
        }

        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const t = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - t, 2);
            const current = Math.round(eased * targetVal);
            el.textContent = current.toLocaleString('en-US') + suffix;

            if (t < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }


    // --- Scroll Animation with IntersectionObserver ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        // Scroll reveal elements
        const scrollRevealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && entry.target.dataset.animated !== 'true') {
                    const delay = parseInt(entry.target.dataset.delay || 0, 10);
                    setTimeout(function () {
                        entry.target.classList.add('is-visible');
                        entry.target.dataset.animated = 'true';
                    }, delay);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.scroll-reveal').forEach(function (el) {
            scrollRevealObserver.observe(el);
        });

        // Incident card animations
        const cardObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && entry.target.dataset.animated !== 'true') {
                    entry.target.classList.add('is-visible');
                    entry.target.dataset.animated = 'true';

                    // Trigger death counter after card animates in
                    const counterEl = entry.target.querySelector('.incident-death-count');
                    if (counterEl) {
                        setTimeout(function () {
                            const target = parseInt(counterEl.dataset.target, 10);
                            const display = counterEl.dataset.display;
                            animateCounter(counterEl, target, display, 1500);
                        }, 500);
                    }
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.incident-card').forEach(function (card) {
            cardObserver.observe(card);
        });

        // Statistics strip counter
        const statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && entry.target.dataset.animated !== 'true') {
                    entry.target.dataset.animated = 'true';
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(function (el) {
                        const target = parseInt(el.dataset.target, 10);
                        const suffix = el.dataset.suffix || '';
                        animateStatCounter(el, target, suffix, 2000);
                    });
                }
            });
        }, { threshold: 0.3 });

        const statsStrip = document.querySelector('.stats-strip');
        if (statsStrip) {
            statsObserver.observe(statsStrip);
        }
    } else {
        // Reduced motion: show everything immediately
        document.querySelectorAll('.scroll-reveal').forEach(function (el) {
            el.classList.add('is-visible');
            el.dataset.animated = 'true';
        });
        document.querySelectorAll('.incident-card').forEach(function (card) {
            card.classList.add('is-visible');
            card.dataset.animated = 'true';
        });
        document.querySelectorAll('.stat-number').forEach(function (el) {
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
            if (target === 0) {
                el.textContent = '0';
            } else {
                el.textContent = target.toLocaleString('en-US') + suffix;
            }
        });
        document.querySelectorAll('.incident-death-count').forEach(function (el) {
            el.textContent = el.dataset.display;
        });
    }

    // --- Blood Drip Effect ---
    function initBloodDrips() {
        if (prefersReducedMotion) return;
        
        const bloodText = document.querySelector('.blood-text');
        if (!bloodText) return;

        // Start adding drips once the element has revealed
        const observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting && entries[0].target.classList.contains('is-visible')) {
                // Drop a drip every 300-800ms
                setInterval(createDrop, 500 + Math.random() * 500); 
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        
        observer.observe(bloodText);

        function createDrop() {
            const drop = document.createElement('div');
            drop.classList.add('blood-drop');
            
            // Randomize position horizontally across the text width
            const leftPct = 10 + Math.random() * 80; 
            drop.style.left = `${leftPct}%`;
            
            // Randomize size
            const size = 3 + Math.random() * 6;
            drop.style.width = `${size}px`;
            drop.style.height = `${size}px`;
            
            // Randomize duration and distance
            const duration = 1.5 + Math.random() * 2;
            drop.style.setProperty('--drip-duration', `${duration}s`);
            
            bloodText.appendChild(drop);
            
            // Cleanup
            setTimeout(() => {
                if(drop.parentNode) drop.remove();
            }, duration * 1000);
        }
    }
    initBloodDrips();
    
    // --- Custom Cursor & Interactive Hero Glow ---
    function initInteractiveElements() {
        if (prefersReducedMotion) return;

        const cursor = document.getElementById('custom-cursor');
        const glow = document.getElementById('hero-glow');
        const magneticElements = document.querySelectorAll('[data-magnetic]');

        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;

            // Update Cursor
            if (cursor) {
                cursor.animate({
                    left: `${clientX}px`,
                    top: `${clientY}px`
                }, { duration: 100, fill: "forwards" });
            }

            // Update Hero Glow (only if mouse is in hero section)
            if (glow) {
                const heroSection = document.getElementById('hero');
                const rect = heroSection.getBoundingClientRect();
                if (clientY >= rect.top && clientY <= rect.bottom) {
                    glow.style.opacity = '1';
                    glow.animate({
                        left: `${clientX - 300}px`,
                        top: `${clientY - 300}px`
                    }, { duration: 800, fill: "forwards" });
                } else {
                    glow.style.opacity = '0';
                }
            }

            // Magnetic Elements
            magneticElements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dx = clientX - centerX;
                const dy = clientY - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const power = 0.35;
                    const x = dx * power;
                    const y = dy * power;
                    el.style.transform = `translate(${x}px, ${y}px)`;
                } else {
                    el.style.transform = 'translate(0, 0)';
                }
            });
        });

        // Hover states for cursor
        const hoverables = document.querySelectorAll('a, button, .incident-card, .problem-card, .audience-card');
        hoverables.forEach((el) => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // --- Smooth Simple Parallax ---
    function initParallax() {
        if (prefersReducedMotion) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Hero parallax
            const heroImg = document.querySelector('.hero-bg img');
            if (heroImg) {
                heroImg.style.transform = `translateY(${scrolled * 0.4}px) scale(1.1)`;
            }

            // Cards Parallax
            const entries = document.querySelectorAll('.audience-img img, .incident-card-bg img');
            entries.forEach((img) => {
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (window.innerHeight - rect.top) * 0.05;
                    img.style.transform = `scale(1.1) translateY(${-offset}px)`;
                }
            });
        });
    }

    initInteractiveElements();
    initParallax();

})();
