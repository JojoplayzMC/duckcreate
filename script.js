// Google Apps Script Backend Web App URL (Replace with your deployed script URL)
const GAS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
});

function setupNavigation() {
    // Select all elements with data-page attributes (nav links, buttons, brand name)
    const pageTriggers = document.querySelectorAll('[data-page]');

    pageTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const targetPage = trigger.getAttribute('data-page');
            if (!targetPage) return;

            navigateToPage(targetPage);
        });
    });
}

function navigateToPage(pageName) {
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-link');

    // Update active state in navigation buttons
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-page') === pageName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Hide all pages and reveal target page
    pages.forEach(p => p.classList.remove('active'));
    const activeSection = document.getElementById(`page-${pageName}`);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    // Dynamic document title update: DuckCreate|[open page]
    const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    document.title = `DuckCreate | ${formattedPageName}`;

    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function copyIP() {
    const ipText = document.getElementById('server-ip').innerText;
    navigator.clipboard.writeText(ipText).then(() => {
        showToast('Copied IP to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function openModal(modalId) {
    const overlay = document.getElementById('modal-overlay');
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(m => m.classList.remove('active'));
    overlay.classList.add('active');
    
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
        targetModal.classList.add('active');
    }
}

function closeModals() {
    const overlay = document.getElementById('modal-overlay');
    const modals = document.querySelectorAll('.modal');
    
    overlay.classList.remove('active');
    modals.forEach(m => m.classList.remove('active'));
}

async function handleBackendSubmit(event, actionType) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = { action: actionType };
    
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Submitting...';
    submitBtn.disabled = true;

    try {
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        showToast('Request submitted successfully!');
        closeModals();
        form.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        showToast('Submission error. Please try again.');
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}