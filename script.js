document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if(mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = '#fff';
            navLinks.style.padding = '20px';
            navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
        });
    }

    // 3. Scroll Reveal Animations (Intersection Observer)
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    reveals.forEach(reveal => revealOnScroll.observe(reveal));

    // 4. Hero Slider (if exists)
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // 5. Number Counters (if exists)
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        let hasCounted = false;
        const counterSection = document.querySelector('.stats');
        
        window.addEventListener('scroll', () => {
            if(!counterSection || hasCounted) return;
            const sectionPos = counterSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight;
            
            if (sectionPos < screenPos) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
                hasCounted = true;
            }
        });
    }

    // 6. Course Filtering Tabs (if exists)
    const tabs = document.querySelectorAll('#courseTabs .tab-btn');
    const cards = document.querySelectorAll('.course-grid .course-card');
    
    if(tabs.length > 0 && cards.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.getAttribute('data-target');
                cards.forEach(card => {
                    if (filter === 'all' || card.innerHTML.toLowerCase().includes(filter.toLowerCase())) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 7. Back to Top Button
    const topBtn = document.querySelector('.back-to-top');
    if(topBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) topBtn.classList.add('visible');
            else topBtn.classList.remove('visible');
        });
        topBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
