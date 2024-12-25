// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-out-cubic',
    once: false,
    mirror: true
});

// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('active');
    
    // Animate nav items
    navLinksItems.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.classList.remove('active');
        burger.classList.remove('active');
        
        const target = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            top: target.offsetTop - 100,
            behavior: 'smooth'
        });
    });
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Portfolio Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
                item.style.display = 'block';
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 500);
            }
        });
    });
});

// Dynamic Portfolio Loading with beautiful images
const portfolioGrid = document.querySelector('.portfolio-grid');
const portfolioProjects = [
    {
        title: 'Site E-commerce Mode',
        category: 'web',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
        description: 'Site e-commerce moderne avec une expérience d\'achat fluide'
    },
    {
        title: 'Application Mobile Santé',
        category: 'app',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
        description: 'Application de suivi de santé et bien-être'
    },
    {
        title: 'Branding Restaurant Bio',
        category: 'brand',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
        description: 'Identité visuelle pour un restaurant bio local'
    }
];

// Load portfolio items with fade effect
function loadPortfolio() {
    portfolioProjects.forEach((project, index) => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = `portfolio-item ${project.category}`;
        portfolioItem.setAttribute('data-aos', 'fade-up');
        portfolioItem.setAttribute('data-aos-delay', index * 100);
        
        portfolioItem.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="portfolio-item-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="#" class="view-project">Voir le projet</a>
            </div>
        `;
        
        portfolioGrid.appendChild(portfolioItem);
    });
}

// Contact Form Handling with Animation
const contactForm = document.getElementById('contact-form');
const formGroups = document.querySelectorAll('.form-group');

formGroups.forEach(group => {
    const input = group.querySelector('input, textarea, select');
    if (input) {
        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                group.classList.remove('focused');
            }
        });
    }
});

// Gestion du formulaire de contact
async function handleSubmit(event) {
    event.preventDefault();

    // Récupération des éléments du formulaire
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Afficher le loading
    btnText.style.display = 'none';
    btnLoading.style.display = 'block';
    submitBtn.disabled = true;

    // Récupération des données du formulaire
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Création du message pour Discord
    const discordMessage = {
        embeds: [{
            title: '🎯 Nouveau Message de Contact',
            color: 0xFF0000, // Rouge pour plus de visibilité
            fields: [
                {
                    name: '👤 Nom',
                    value: formData.name,
                    inline: true
                },
                {
                    name: '📧 Email',
                    value: formData.email,
                    inline: true
                },
                {
                    name: '📝 Sujet',
                    value: formData.subject,
                    inline: false
                },
                {
                    name: '💬 Message',
                    value: formData.message,
                    inline: false
                }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        // Envoi au webhook Discord
        const response = await fetch('https://discord.com/api/webhooks/1320424762727727196/Q9xVOgZNK1BHv2o743mUjEVS5QIY0hiXVcY7lp40lHenc6pfsXbsvs4JhnmwPDdNxPA1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordMessage)
        });

        if (response.ok) {
            // Réinitialiser le formulaire
            form.reset();
            
            // Afficher un message de succès
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Message envoyé avec succès !';
            form.appendChild(successMessage);
            
            // Supprimer le message après 5 secondes
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        } else {
            throw new Error('Erreur lors de l\'envoi');
        }
    } catch (error) {
        // Afficher un message d'erreur
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
        form.appendChild(errorMessage);
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    } finally {
        // Restaurer le bouton
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

contactForm.addEventListener('submit', handleSubmit);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolio();
});
