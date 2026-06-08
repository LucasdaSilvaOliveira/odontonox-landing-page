/**
 * OdontoNox Landing Page — Vanilla JavaScript
 * No frameworks. Pure JS.
 */

(function () {
    'use strict';

    /* --- DOM References --- */
    var header = document.getElementById('header');
    var nav = document.getElementById('nav');
    var menuToggle = document.getElementById('menuToggle');
    var contactForm = document.getElementById('contactForm');
    var toast = document.getElementById('toast');
    var demoTabs = document.querySelectorAll('.demo__tab');
    var fadeElements = document.querySelectorAll('.fade-in');

    /* --- Header Scroll Effect --- */
    function handleHeaderScroll() {
        if (window.scrollY > 20) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    /* --- Mobile Menu --- */
    function toggleMobileMenu() {
        var isOpen = nav.classList.toggle('is-open');
        menuToggle.classList.toggle('is-active', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMobileMenu() {
        nav.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    /* --- Demo Screen Tabs --- */
    function switchDemoScreen(screenName) {
        demoTabs.forEach(function (tab) {
            var isActive = tab.dataset.screen === screenName;
            tab.classList.toggle('demo__tab--active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });

        document.querySelectorAll('.demo__screen').forEach(function (screen) {
            var isActive = screen.id === 'screen-' + screenName;
            screen.classList.toggle('demo__screen--active', isActive);
            screen.hidden = !isActive;
        });
    }

    /* --- Scroll Animations (Intersection Observer) --- */
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            fadeElements.forEach(function (el) {
                el.classList.add('is-visible');
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        fadeElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* --- Toast Notification --- */
    var toastTimeout;

    function showToast(message, type) {
        type = type || 'success';
        toast.textContent = message;
        toast.className = 'toast toast--' + type + ' is-visible';

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function () {
            toast.classList.remove('is-visible');
        }, 4000);
    }

    /* --- Form Validation --- */
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        var digits = phone.replace(/\D/g, '');
        return digits.length >= 10;
    }

    function clearFormErrors() {
        contactForm.querySelectorAll('.form-input').forEach(function (input) {
            input.classList.remove('is-error');
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        clearFormErrors();

        var name = document.getElementById('name');
        var email = document.getElementById('email');
        var phone = document.getElementById('phone');
        var clinic = document.getElementById('clinic');
        var role = document.getElementById('role');
        var hasError = false;

        if (!name.value.trim()) {
            name.classList.add('is-error');
            hasError = true;
        }

        if (!validateEmail(email.value.trim())) {
            email.classList.add('is-error');
            hasError = true;
        }

        if (!validatePhone(phone.value.trim())) {
            phone.classList.add('is-error');
            hasError = true;
        }

        if (!clinic.value.trim()) {
            clinic.classList.add('is-error');
            hasError = true;
        }

        if (!role.value) {
            role.classList.add('is-error');
            hasError = true;
        }

        if (hasError) {
            showToast('Por favor, preencha todos os campos corretamente.', 'error');
            return;
        }

        var submitBtn = contactForm.querySelector('[type="submit"]');
        var originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(function () {
            showToast('Demonstração agendada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1200);
    }

    /* --- Phone Mask --- */
    function maskPhone(input) {
        var value = input.value.replace(/\D/g, '');

        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }

        input.value = value.trim().replace(/-$/, '');
    }

    /* --- Smooth Scroll for Anchor Links --- */
    function handleSmoothScroll(e) {
        var href = this.getAttribute('href');

        if (!href || href.charAt(0) !== '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: 'smooth' });
    }

    /* --- Active Nav Link on Scroll --- */
    function updateActiveNavLink() {
        var sections = document.querySelectorAll('section[id]');
        var scrollPos = window.scrollY + 100;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav__link').forEach(function (link) {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + id) {
                        link.style.color = 'var(--color-accent)';
                    }
                });
            }
        });
    }

    /* --- Initialize --- */
    function init() {
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        window.addEventListener('scroll', updateActiveNavLink, { passive: true });
        handleHeaderScroll();

        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileMenu);
        }

        demoTabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                switchDemoScreen(tab.dataset.screen);
            });
        });

        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        var phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function () {
                maskPhone(phoneInput);
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', handleSmoothScroll);
        });

        initScrollAnimations();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
