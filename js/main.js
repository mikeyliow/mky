// Load and populate content
async function loadContent() {
    try {
        const response = await fetch('data/content.json');
        const data = await response.json();
        
        // Create gradient favicon
        createGradientFavicon();
        
        // Update simple text content
        document.querySelectorAll('[data-content]').forEach(element => {
            const contentPath = element.getAttribute('data-content');
            if (contentPath === 'socialLinks') return; // Handle social links separately
            
            // Handle nested properties (e.g., personalMessage.currentStatus)
            const value = contentPath.split('.').reduce((obj, key) => obj[key], data);
            if (value) {
                if (contentPath === 'personalMessage') {
                    element.innerHTML = value; // Use innerHTML for the personal message to render the spans
                } else if (contentPath === 'email') {
                    element.href = `mailto:${value}`;
                    element.textContent = value;
                } else {
                    element.textContent = value;
                }
            }
        });

        // Update social links
        const socialLinksContainer = document.querySelector('[data-content="socialLinks"]');
        if (socialLinksContainer) {
            socialLinksContainer.innerHTML = data.socialLinks.map(link => `
                <a href="${link.url}" class="social-link" aria-label="${link.platform}" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-${link.icon}"></i>
                </a>
            `).join('');
        }

        // Update page title
        document.title = `${data.name} | personal site`;
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function createGradientFavicon() {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // Fill with crimson
    ctx.fillStyle = '#dc143c';
    ctx.fillRect(0, 0, 32, 32);

    // Load original icon
    const img = new Image();
    img.src = 'images/icon.png';
    img.onload = function() {
        // Draw original icon as mask
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(img, 0, 0, 32, 32);

        // Set as favicon
        const link = document.querySelector("link[rel~='icon']");
        link.href = canvas.toDataURL('image/png');
    };
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Add any future JavaScript functionality here 