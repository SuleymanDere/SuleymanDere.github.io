document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('tabindex', '0');
        hamburger.setAttribute('aria-label', 'Menüyü aç');
        hamburger.setAttribute('aria-expanded', 'false');

        const toggleMenu = () => {
            const isOpen = navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            hamburger.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
        };

        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleMenu();
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') {
            return;
        }

        anchor.addEventListener('click', (event) => {
            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const updateNavbarShadow = () => {
            navbar.style.boxShadow = window.scrollY > 50
                ? '0 4px 20px rgba(0,0,0,0.1)'
                : '0 2px 10px rgba(0,0,0,0.1)';
        };

        updateNavbarShadow();
        window.addEventListener('scroll', updateNavbarShadow, { passive: true });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((button) => button.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            productItems.forEach((item) => {
                item.style.display = filter === 'all' || item.getAttribute('data-category') === filter
                    ? 'grid'
                    : 'none';
            });
        });
    });

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach((faqItem) => faqItem.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    document.querySelectorAll('form').forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Mesajınız alındı! En kısa sürede size dönüş yapacağız.');
            form.reset();
        });
    });
});
