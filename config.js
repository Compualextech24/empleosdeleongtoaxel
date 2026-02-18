console.log('🚀 Iniciando aplicación Empleos León GTO...');

// ==================== INICIALIZAR SUPABASE ====================
const { createClient } = supabase;
const supabaseClient = createClient(ENDPOINTS.SUPABASE_URL, ENDPOINTS.SUPABASE_ANON_KEY);

// ==================== ESTADO GLOBAL SIMPLIFICADO ====================
let state = {
    view: 'login',
    user: null,
    isGuest: false,
    vacancies: [],
    filteredVacancies: [],
    editingVacancy: null,
    loading: false,
    formData: {
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        job_title: '',
        description: '',
        location: 'León, gto',
        contact_phone: '',
        publication_date: '',
        schedule: '',
        work_days: '',
        category: '',
        imageBase64: ''
    }
};

// ==================== UTILIDADES ====================
const showLoading = () => {
    if (document.getElementById('loader-overlay')) return;
    state.loading = true;
    const loader = document.createElement('div');
    loader.id = 'loader-overlay';
    loader.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
    loader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loader);
};

const hideLoading = () => {
    state.loading = false;
    const loader = document.getElementById('loader-overlay');
    if (loader) loader.remove();
};

const escapeHtml = (text) => {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
};

// ==================== MODAL ====================
const showModal = (type, title, message, onConfirm = null) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle',
        question: 'fa-question-circle'
    };
    
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        question: '#22c55e'
    };
    
    const isQuestion = type === 'question';
    
    modal.innerHTML = `
        <div class="modal-window">
            <div class="modal-header modal-header-${type}">
                <i class="fas ${icons[type]}" style="color:${colors[type]}"></i>
                <div class="header-text">
                    <h3>${escapeHtml(title)}</h3>
                </div>
            </div>
            <div class="modal-body">${escapeHtml(message)}</div>
            <div class="modal-footer">
                ${isQuestion 
                    ? '<button class="btn btn-cancel modal-cancel">Cancelar</button><button class="btn btn-primary modal-confirm">Aceptar</button>'
                    : '<button class="btn btn-primary modal-ok">Aceptar</button>'
                }
            </div>
        </div>
    `;
    
    document.getElementById('modal-root').appendChild(modal);
    
    if (isQuestion) {
        modal.querySelector('.modal-cancel').onclick = () => modal.remove();
        modal.querySelector('.modal-confirm').onclick = () => {
            modal.remove();
            if (onConfirm) onConfirm();
        };
    } else {
        modal.querySelector('.modal-ok').onclick = () => modal.remove();
        setTimeout(() => modal.remove(), 8000);
    }
    
    modal.onclick = (e) => {
        if (e.target === modal && !isQuestion) modal.remove();
    };
};

// ==================== RESET DE FORMULARIOS ====================
function resetAuthForm() {
    state.formData.email = '';
    state.formData.password = '';
    state.formData.confirmPassword = '';
}

function resetJobForm() {
    state.formData.company = '';
    state.formData.job_title = '';
    state.formData.description = '';
    state.formData.location = 'León, gto';
    state.formData.contact_phone = '';
    state.formData.publication_date = '';
    state.formData.schedule = '';
    state.formData.work_days = '';
    state.formData.category = '';
    state.formData.imageBase64 = '';
}

function resetCompleteState() {
    console.log('🔄 Reseteando estado completo...');
    state.user = null;
    state.isGuest = false;
    state.view = 'login';
    state.vacancies = [];
    state.filteredVacancies = [];
    state.editingVacancy = null;
    state.loading = false;
    resetAuthForm();
    resetJobForm();
}

console.log('✅ Config.js cargado correctamente');
