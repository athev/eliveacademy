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
            navLinks.classList.toggle('mobile-active');
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
            });
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
    // 8. Form Handling (API Integration)
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        // Remove old inline onsubmit if present
        form.removeAttribute('onsubmit');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'ĐANG XỬ LÝ...';
            btn.disabled = true;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Determine endpoint based on page/form context
            const endpoint = window.location.pathname.includes('course-detail') ? '/api/register' : '/api/contact';

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                if (result.success) {
                    alert('Đăng ký thành công! Hệ thống ELIVE ACADEMY sẽ liên hệ với bạn trong 24h.');
                    form.reset();
                } else {
                    alert('Có lỗi xảy ra: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    });
    // 9. Centralized Floating Widgets Injection
    const widgetsHTML = `
        <div class="floating-widgets">
            <a href="https://zalo.me/yourphone" target="_blank" class="widget zallo" title="Chat Zalo"><i class="fa-solid fa-comment-dots"></i></a>
            <a href="https://m.me/yourpage" target="_blank" class="widget messenger" title="Chat Messenger"><i class="fa-brands fa-facebook-messenger"></i></a>
            <a href="tel:1900123456" class="widget phone" title="Gọi Điện"><i class="fa-solid fa-phone-volume"></i></a>
        </div>
        <a href="#" class="back-to-top"><i class="fa-solid fa-arrow-up"></i></a>
    `;
    document.body.insertAdjacentHTML('beforeend', widgetsHTML);

    // Refresh Back to Top logic after injection
    const topBtnMoved = document.querySelector('.back-to-top');
    if(topBtnMoved) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) topBtnMoved.classList.add('visible');
            else topBtnMoved.classList.remove('visible');
        });
        topBtnMoved.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
