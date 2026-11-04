import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import '../css/template.css';

const SHOW_ERROR_MODAL = import.meta.env.VITE_SHOW_ERROR_MODAL === 'true';

function mountGlobalToastContainer() {
    if (document.getElementById('global-toast-container')) return;
    const el = document.createElement('div');
    el.id = 'global-toast-container';
    el.style.cssText = [
        'position:fixed', 'top:20px', 'right:20px', 'z-index:99999',
        'display:flex', 'flex-direction:column', 'gap:10px',
        'align-items:flex-end', 'pointer-events:none',
    ].join(';');
    document.body.appendChild(el);
}

function showErrorToast(message) {
    mountGlobalToastContainer();
    const container = document.getElementById('global-toast-container');

    const toast = document.createElement('div');
    toast.style.cssText = [
        'display:flex', 'align-items:center', 'gap:12px',
        'background:#FEF2F2', 'border-radius:6px', 'padding:10px 14px',
        'min-width:288px', 'max-width:400px',
        'box-shadow:0 3px 10px rgba(0,0,0,0.16)',
        'font-family:Manrope,sans-serif',
        'transform:translateX(110%)', 'opacity:0',
        'transition:transform 300ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ease',
        'pointer-events:auto',
    ].join(';');

    toast.innerHTML = `
        <span style="color:#EF4444;flex-shrink:0;display:flex">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
        </span>
        <span style="font-size:13.5px;line-height:1.5;flex:1;color:#991B1B;font-weight:500">${message}</span>
        <button type="button" data-dismiss style="background:none;border:none;color:#EF4444;cursor:pointer;padding:2px;line-height:1;flex-shrink:0;display:flex;opacity:0.7;border-radius:4px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        });
    });

    const dismiss = () => {
        toast.style.transform = 'translateX(110%)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('[data-dismiss]').addEventListener('click', dismiss);
    setTimeout(dismiss, 5000);
}

if (!SHOW_ERROR_MODAL) {
    // Inertia v3 fires 'httpException' for non-Inertia HTTP error responses (400, 500, etc.)
    // Calling preventDefault() stops the built-in <dialog id="inertia-error-dialog"> from appearing.
    router.on('httpException', (event) => {
        event.preventDefault();
        const status = event.detail?.response?.status ?? 500;
        const message = status >= 500
            ? 'Terjadi kesalahan pada server. Silakan coba lagi.'
            : 'Permintaan tidak dapat diproses. Silakan coba lagi.';
        showErrorToast(message);
    });
}

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        const spinner = document.getElementById('global-spinner');

        const root = createRoot(el);
        root.render(<App {...props} />);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (spinner) spinner.remove();
            });
        });
    },
});
