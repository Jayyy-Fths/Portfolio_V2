/* ====================================================
   RUMMAN JALALI — FUTURISTIC 3D PORTFOLIO
   Script: Three.js + GSAP + Vanilla JS
   ==================================================== */

// ══════════════════════════════════════════════════════
// 1. CUSTOM CURSOR
// ══════════════════════════════════════════════════════

(function initCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover detection for interactive elements
    const interactiveEls = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-card, .filter-btn');
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
            ring.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
            ring.classList.remove('hover');
        });
    });
})();


// ══════════════════════════════════════════════════════
// 2. PAGE LOADER
// ══════════════════════════════════════════════════════

window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    setTimeout(() => {
        loader.classList.add('hidden');
        // Trigger hero animations after loader
        animateHeroEntrance();
    }, 1800);
});


// ══════════════════════════════════════════════════════
// 3. NAVBAR
// ══════════════════════════════════════════════════════

(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Active section highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[data-section="${id}"]`);
            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    links.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
})();


// ══════════════════════════════════════════════════════
// 4. THREE.JS — HERO GALAXY SCENE
// ══════════════════════════════════════════════════════

(function initHeroScene() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Particle Galaxy ---
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Spiral galaxy distribution
        const radius = Math.random() * 4;
        const spin = radius * 2.5;
        const branchAngle = ((i % 3) / 3) * Math.PI * 2;
        const randomX = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * 1.5;
        const randomY = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * 0.8;
        const randomZ = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * 1.5;

        positions[i3] = Math.cos(branchAngle + spin) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spin) * radius + randomZ;

        // Colors: neon blue to white
        const mixRatio = Math.random();
        colors[i3] = mixRatio * 0.0 + (1 - mixRatio) * 0.5;      // R
        colors[i3 + 1] = mixRatio * 0.96 + (1 - mixRatio) * 0.8;  // G
        colors[i3 + 2] = mixRatio * 1.0 + (1 - mixRatio) * 1.0;   // B

        sizes[i] = Math.random() * 2.5 + 0.5;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.015,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Floating orbs ---
    const orbGroup = new THREE.Group();
    const orbGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const orbMaterial = new THREE.MeshBasicMaterial({
        color: 0x00F5FF,
        transparent: true,
        opacity: 0.6
    });

    for (let i = 0; i < 15; i++) {
        const orb = new THREE.Mesh(orbGeometry, orbMaterial.clone());
        orb.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
        );
        orb.userData = {
            speed: Math.random() * 0.005 + 0.002,
            amplitude: Math.random() * 0.5 + 0.3,
            phase: Math.random() * Math.PI * 2
        };
        orbGroup.add(orb);
    }
    scene.add(orbGroup);

    // --- Connection lines between nearby orbs ---
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00F5FF,
        transparent: true,
        opacity: 0.08
    });

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Rotate galaxy
        particles.rotation.y = elapsed * 0.05;
        particles.rotation.x = Math.sin(elapsed * 0.03) * 0.1;

        // Animate orbs
        orbGroup.children.forEach(orb => {
            const d = orb.userData;
            orb.position.y += Math.sin(elapsed * d.speed * 100 + d.phase) * 0.002;
            orb.position.x += Math.cos(elapsed * d.speed * 50 + d.phase) * 0.001;
        });

        // Mouse parallax on camera
        camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();


// ══════════════════════════════════════════════════════
// 5. THREE.JS — ABOUT SECTION 3D OBJECT
// ══════════════════════════════════════════════════════

(function initAboutScene() {
    const canvas = document.getElementById('aboutCanvas');
    if (!canvas) return;

    const wrapper = canvas.parentElement;
    const w = wrapper.clientWidth;
    const h = wrapper.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Wireframe Icosahedron ---
    const icoGeometry = new THREE.IcosahedronGeometry(1.4, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0x00F5FF,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    scene.add(icosahedron);

    // Inner sphere
    const innerGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0x00F5FF,
        transparent: true,
        opacity: 0.05,
        wireframe: false
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // Floating dots around the icosahedron
    const dotGroup = new THREE.Group();
    const dotGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x00F5FF, transparent: true, opacity: 0.7 });

    for (let i = 0; i < 30; i++) {
        const dot = new THREE.Mesh(dotGeo, dotMat.clone());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 1.8 + Math.random() * 0.6;
        dot.position.setFromSphericalCoords(r, phi, theta);
        dot.userData = { theta, phi, r, speed: Math.random() * 0.3 + 0.1 };
        dotGroup.add(dot);
    }
    scene.add(dotGroup);

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        icosahedron.rotation.x = t * 0.2;
        icosahedron.rotation.y = t * 0.3;
        innerSphere.rotation.y = -t * 0.15;

        // Animate dots
        dotGroup.children.forEach(dot => {
            const d = dot.userData;
            const newTheta = d.theta + t * d.speed * 0.2;
            dot.position.setFromSphericalCoords(d.r, d.phi, newTheta);
            dot.material.opacity = 0.3 + Math.sin(t * d.speed * 3) * 0.4;
        });

        renderer.render(scene, camera);
    }
    animate();

    // Resize
    const observer = new ResizeObserver(() => {
        const ww = wrapper.clientWidth;
        const hh = wrapper.clientHeight;
        camera.aspect = ww / hh;
        camera.updateProjectionMatrix();
        renderer.setSize(ww, hh);
    });
    observer.observe(wrapper);
})();


// ══════════════════════════════════════════════════════
// 6. HERO ENTRANCE ANIMATIONS
// ══════════════════════════════════════════════════════

function animateHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-badge', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2
    })
    .to('.line-1', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.4')
    .to('.line-2', {
        opacity: 1,
        y: 0,
        duration: 1
    }, '-=0.4')
    .to('.hero-typing', {
        opacity: 1,
        duration: 0.6
    }, '-=0.4')
    .to('.hero-description', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.3')
    .to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.4')
    .to('.hero-stats', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.4')
    .to('.scroll-indicator', {
        opacity: 1,
        duration: 0.6
    }, '-=0.2');

    // Start typing animation
    startTypingAnimation();

    // Start counter animation
    animateCounters();
}


// ══════════════════════════════════════════════════════
// 7. TYPING ANIMATION
// ══════════════════════════════════════════════════════

function startTypingAnimation() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const strings = [
        'Data Scientist',
        'ML Engineer',
        'Problem Solver',
        'Deep Learning Enthusiast',
        'Data Storyteller'
    ];
    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const current = strings[stringIndex];

        if (!isDeleting) {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause before deleting
            } else {
                typingSpeed = 80 + Math.random() * 40;
            }
        } else {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                stringIndex = (stringIndex + 1) % strings.length;
                typingSpeed = 400; // Pause before next string
            } else {
                typingSpeed = 40;
            }
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}


// ══════════════════════════════════════════════════════
// 8. COUNTER ANIMATION
// ══════════════════════════════════════════════════════

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            counter.textContent = Math.round(eased * target);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    });
}


// ══════════════════════════════════════════════════════
// 9. GSAP SCROLL ANIMATIONS
// ══════════════════════════════════════════════════════

(function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // --- Section headers ---
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // --- About section ---
    gsap.from('.about-3d-wrapper', {
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: 60,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.about-card', {
        scrollTrigger: {
            trigger: '.about-cards',
            start: 'top 90%',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // --- Skill cards ---
    gsap.from('.skill-card', {
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%',
            toggleActions: 'play none none none',
            onEnter: animateSkillRings
        },
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
    });

    // --- Project cards ---
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // --- Timeline items ---
    document.querySelectorAll('.timeline-item').forEach(item => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // --- Contact section ---
    gsap.from('.contact-card', {
        scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: -40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
    });

    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.social-links', {
        scrollTrigger: {
            trigger: '.social-links',
            start: 'top 90%',
            toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
    });

    // --- Filter buttons ---
    gsap.from('.filter-btn', {
        scrollTrigger: {
            trigger: '.filter-buttons',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out'
    });
})();


// ══════════════════════════════════════════════════════
// 10. SKILL RING ANIMATIONS
// ══════════════════════════════════════════════════════

function animateSkillRings() {
    const rings = document.querySelectorAll('.ring-fill');
    const circumference = 2 * Math.PI * 52; // r=52

    rings.forEach(ring => {
        const percent = parseInt(ring.getAttribute('data-percent'));
        const offset = circumference - (percent / 100) * circumference;
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = circumference;

        // Trigger animation
        setTimeout(() => {
            ring.style.strokeDashoffset = offset;
        }, 200);
    });
}


// ══════════════════════════════════════════════════════
// 11. PROJECT FILTER
// ══════════════════════════════════════════════════════

(function initProjectFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    gsap.fromTo(card,
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
                    );
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
})();


// ══════════════════════════════════════════════════════
// 12. 3D TILT EFFECT ON PROJECT CARDS
// ══════════════════════════════════════════════════════

(function initTiltCards() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
})();


// ══════════════════════════════════════════════════════
// 13. CONTACT FORM VALIDATION
// ══════════════════════════════════════════════════════

(function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const subject = document.getElementById('formSubject').value.trim();
        const message = document.getElementById('formMessage').value.trim();

        // Validation
        if (!name || !email || !subject || !message) {
            showStatus('Please fill in all fields.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showStatus('Please enter a valid email address.', 'error');
            return;
        }

        if (message.length < 10) {
            showStatus('Message should be at least 10 characters.', 'error');
            return;
        }

        // Simulate submission
        const submitBtn = document.getElementById('formSubmit');
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Sending...';

        setTimeout(() => {
            showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Send Message';

            // Clear status after 5s
            setTimeout(() => {
                status.textContent = '';
                status.className = 'form-status';
            }, 5000);
        }, 1500);
    });

    function showStatus(msg, type) {
        status.textContent = msg;
        status.className = `form-status ${type}`;
    }
})();


// ══════════════════════════════════════════════════════
// 14. BACK TO TOP BUTTON
// ══════════════════════════════════════════════════════

(function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();


// ══════════════════════════════════════════════════════
// 15. SMOOTH SCROLL FOR ANCHOR LINKS
// ══════════════════════════════════════════════════════

(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
})();


// ══════════════════════════════════════════════════════
// 16. PARALLAX ON SCROLL
// ══════════════════════════════════════════════════════

(function initParallax() {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
        }
    });
})();


// ══════════════════════════════════════════════════════
// 17. SKILL CARD TOOLTIP ON HOVER
// ══════════════════════════════════════════════════════

(function initSkillTooltips() {
    const cards = document.querySelectorAll('.skill-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const skillName = card.getAttribute('data-skill');
            const level = card.getAttribute('data-level');

            // Add glow effect
            card.style.boxShadow = `0 0 40px rgba(0, 245, 255, 0.15), 0 20px 40px rgba(0, 0, 0, 0.3)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });
})();


// ══════════════════════════════════════════════════════
// 18. LAZY LOAD INTERSECTION OBSERVER
// ══════════════════════════════════════════════════════

(function initLazyLoad() {
    const lazyElements = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    lazyElements.forEach(el => observer.observe(el));
})();


// ══════════════════════════════════════════════════════
// 19. FPS OPTIMIZATION — Pause off-screen Three.js
// ══════════════════════════════════════════════════════

(function initPerfOptimizations() {
    // Reduce animations when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            gsap.globalTimeline.pause();
        } else {
            gsap.globalTimeline.resume();
        }
    });
})();


// ══════════════════════════════════════════════════════
// 20. CONSOLE SIGNATURE
// ══════════════════════════════════════════════════════

console.log(
    '%c⚡ Rumman Jalali — Portfolio',
    'color: #00F5FF; font-family: Orbitron, monospace; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px #00F5FF;'
);
console.log(
    '%cBuilt with Three.js + GSAP + Pure Passion 🚀',
    'color: #8892b0; font-size: 11px;'
);
