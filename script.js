// Canvas con partículas mejoradas
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        // Colores alternados entre verde y azul
        this.color = Math.random() > 0.5 ? '#00ff88' : '#00ccff';
        // Velocidad de parpadeo
        this.blinkSpeed = Math.random() * 0.02;
        this.blinkOffset = Math.random() * 100;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Rebote en los bordes
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
        
        // Efecto de parpadeo
        this.currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(Date.now() * this.blinkSpeed + this.blinkOffset));
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.currentOpacity || this.opacity;
        ctx.fill();
        
        // Resetear efectos
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}

// Crear partículas (más en desktop, menos en móvil)
const particleCount = window.innerWidth < 768 ? 60 : 120;
const particles = [];

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Estrellas adicionales
class Star {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.opacity = Math.random() * 0.5;
        this.blinkSpeed = Math.random() * 0.03;
    }
    
    update() {
        // Las estrellas parpadean pero no se mueven
        this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(Date.now() * this.blinkSpeed));
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = this.currentOpacity || this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

const stars = [];
for (let i = 0; i < 50; i++) {
    stars.push(new Star());
}

function animate() {
    // Limpiar canvas con un pequeño rastro para efecto de movimiento
    ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar estrellas primero (fondo)
    for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw();
    }
    
    // Dibujar partículas
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    
    requestAnimationFrame(animate);
}

animate();

// Ajustar al redimensionar
window.addEventListener('resize', () => {
    resizeCanvas();
    for (let i = 0; i < particles.length; i++) {
        particles[i].reset();
    }
    for (let i = 0; i < stars.length; i++) {
        stars[i].reset();
    }
});

// ============================================
// MENÚ HAMBURGUESA
// ============================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
}

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// ACTIVE NAVIGATION BASED ON SCROLL
// ============================================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// ============================================
// LANGUAGE SELECTOR
// ============================================
const langButtons = document.querySelectorAll('.lang-btn');
const html = document.documentElement;

// Función para cambiar idioma
function setLanguage(lang) {
    html.lang = lang;
    
    // Actualizar botones activos
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Actualizar todos los elementos con data-en y data-es
    document.querySelectorAll('[data-en][data-es]').forEach(el => {
        el.textContent = el.dataset[lang];
    });
    
    // Actualizar placeholders si los hay
    document.querySelectorAll('input[data-en][data-es]').forEach(el => {
        el.placeholder = el.dataset[lang];
    });
    
    // Guardar preferencia en localStorage
    localStorage.setItem('preferredLanguage', lang);
}

// Agregar event listeners a los botones de idioma
langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
    });
});

// Cargar idioma preferido o usar español por defecto
const savedLang = localStorage.getItem('preferredLanguage') || 'es';
setLanguage(savedLang);

// ============================================
// EFECTOS DE ENTRADA (INTERSECTION OBSERVER)
// ============================================
// Animación al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar a tarjetas y secciones
document.querySelectorAll('.cyber-card, .section > h2').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// ============================================
// EFECTO DE TEXTO NEON (OPCIONAL)
// ============================================
function createNeonEffect() {
    const neonElements = document.querySelectorAll('.neon-text, .giant-glitch');
    
    neonElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.animation = 'glitch-effect 0.3s infinite';
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.animation = '';
        });
    });
}

// Llamar después de que cargue la página
window.addEventListener('load', createNeonEffect);

// ============================================
// CONTADORES ANIMADOS PARA STATS
// ============================================
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        if (isNaN(target)) return;
        
        let current = 0;
        const increment = target / 50; // 50 pasos
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 20);
    });
}

// Activar contadores cuando la sección hero sea visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            heroObserver.unobserve(entry.target); // Solo una vez
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// ============================================
// PARALLAX EFFECT (OPCIONAL)
// ============================================
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        hero.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
});

// ============================================
// DETECTAR DISPOSITIVO MÓVIL Y AJUSTAR
// ============================================
function isMobile() {
    return window.innerWidth <= 768;
}

if (isMobile()) {
    // Reducir efectos pesados en móvil
    document.body.classList.add('mobile-device');
    
    // Desactivar parallax en móvil
    window.removeEventListener('scroll', () => {});
}

// ============================================
// MANEJAR ERRORES DE CARGA
// ============================================
window.addEventListener('error', (e) => {
    console.log('Error cargando recurso:', e);
});

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('FinSecure Bank - Página cargada correctamente');
    
    // Forzar actualización de idioma
    setLanguage(html.lang);
    
    // Ajustar elementos visibles
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
});

// ============================================
// EFECTO DE ESCRITURA PARA EL QUOTE (OPCIONAL)
// ============================================
const quoteElement = document.querySelector('.quote span:not(.quote-text)');
if (quoteElement && isMobile() === false) { // Solo en desktop
    const originalText = quoteElement.textContent;
    quoteElement.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            quoteElement.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 30);
        }
    }
    
    // Iniciar cuando sea visible
    const quoteObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                quoteObserver.unobserve(entry.target);
            }
        });
    });
    
    quoteObserver.observe(quoteElement);
}