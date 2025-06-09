// Load and populate content
async function loadContent() {
    try {
        const response = await fetch('data/content.json');
        const data = await response.json();

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