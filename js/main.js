async function loadContent() {
    try {
        const response = await fetch('data/content.json');
        const data = await response.json();

        document.querySelectorAll('[data-content]').forEach(element => {
            const contentPath = element.getAttribute('data-content');
            if (contentPath === 'socialLinks') return;

            const value = contentPath.split('.').reduce((obj, key) => obj[key], data);
            if (value !== undefined) {
                if (contentPath === 'personalMessage') {
                    element.innerHTML = value;
                } else if (contentPath === 'email') {
                    element.href = `mailto:${value}`;
                    element.textContent = value;
                } else {
                    element.textContent = value;
                }
            }
        });
        const socialLinksContainer = document.querySelector('[data-content="socialLinks"]');
        if (socialLinksContainer) {
            socialLinksContainer.innerHTML = data.socialLinks.map(link => `
                <a href="${link.url}" class="social-link" aria-label="${link.platform}" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-${link.icon}"></i>
                </a>
            `).join('');
        }

        document.title = `${data.name} | personal site`;
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadContent();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 