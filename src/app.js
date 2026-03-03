import { renderHome } from './pages/home.js';
import { renderBooking } from './pages/booking.js';
import { renderConfirmation } from './pages/confirmation.js';
import { renderTerms } from './pages/terms.js';

const routes = {
    '/': renderHome,
    '/book': renderBooking,
    '/confirmation': renderConfirmation,
    '/terms': renderTerms,
};

let currentState = {};

export function getState() {
    return currentState;
}

export function setState(updates) {
    currentState = { ...currentState, ...updates };
}

export function navigate(path, state = {}) {
    setState(state);
    window.history.pushState(state, '', path);
    render(path);
}

function render(path) {
    const app = document.getElementById('app');
    const route = routes[path] || routes['/'];

    // Fade out
    app.style.opacity = '0';
    app.style.transform = 'translateY(8px)';

    setTimeout(() => {
        route(app);
        // Fade in
        requestAnimationFrame(() => {
            app.style.opacity = '1';
            app.style.transform = 'translateY(0)';
        });
    }, 200);
}

// Handle back/forward
window.addEventListener('popstate', (e) => {
    if (e.state) setState(e.state);
    render(window.location.pathname);
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    render(window.location.pathname);
});
