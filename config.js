console.log('🚀 Iniciando aplicación Empleos León GTO...');

// ==================== INICIALIZAR CLIENTE SUPABASE ====================
const { createClient } = supabase;
const supabaseClient = createClient(ENDPOINTS.SUPABASE_URL, ENDPOINTS.SUPABASE_ANON_KEY);

// ==================== ESTADO GLOBAL DE LA APLICACIÓN ====================
let state = {
    view: 'login',
    user: null,
    isGuest: false,
    vacancies: [],
    filteredVacancies: [],
    dateFilter: null,
    editingVacancy: null,
    showPassword: false,
    showConfirmPassword: false,
    menuOpen: false,
    acceptedTerms: false,
    loading: false,
    isRendering: false,
    calendarOpen: false,
    calendarMonth: new Date().getMonth(),
    calendarYear: new Date().getFullYear(),
    formData: {
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        job_title: '',
        description: '',
        location: '',
        contact_phone: '',
        publication_date: '',
        schedule: '',
        work_days: '',
        category: '',
        imageBase64: ''
    },
    aiChatOpen: false,
    aiMessages: [],
    aiLoading: false,
    aiImage: null,
    aiImagePreview: null,
    aiExtractedData: null,
    chatMinimized: false,
    isLoggingOut: false
};

// ==================== UTILIDADES ====================
const showLoading = () => {
    if (document.getElementById('loader-overlay')) return;
    state.loading = true;
    state.isRendering = false; // ← desbloquear render si estaba atascado
    const loader = document.createElement('div');
    loader.id = 'loader-overlay';
    loader.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
    loader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loader);
    // Global safety: auto-hide after 15 seconds to prevent infinite spinner
    setTimeout(() => {
        if (document.getElementById('loader-overlay')) {
            console.warn('⚠️ Safety timeout: cerrando spinner automáticamente');
            hideLoading();
        }
    }, 15000);
};

const hideLoading = () => {
    state.loading = false;
    // Remove ALL loader overlays (safety in case of duplicates)
    document.querySelectorAll('#loader-overlay').forEach(el => el.remove());
};

const escapeHtml = (text) => {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
};

// ==================== MODAL ESTILO WINDOWS ====================
// Tipos disponibles: success, error, warning, info, question (positivo/neutro), question-danger (destructivo → header rojo)
const showModal = (type, title, message, onConfirm = null) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    const icons = {
        success:         'fa-check-circle',
        error:           'fa-exclamation-circle',
        warning:         'fa-exclamation-triangle',
        info:            'fa-info-circle',
        question:        'fa-question-circle',
        'question-danger': 'fa-exclamation-triangle'
    };

    const colors = {
        success:         '#22c55e',
        error:           '#ef4444',
        warning:         '#f59e0b',
        info:            '#3b82f6',
        question:        '#22c55e',          // positivo → verde
        'question-danger': '#ef4444'         // destructivo → rojo
    };

    // Clase CSS del header (question-danger usa la clase de error para el fondo rojo)
    const headerClass = type === 'question-danger' ? 'modal-header-error' : `modal-header-${type}`;

    const isQuestion = type === 'question' || type === 'question-danger';

    modal.innerHTML = `
        <div class="modal-window">
            <div class="modal-header ${headerClass}">
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

// ==================== CALENDARIO ====================
function openCalendar() {
    state.calendarOpen = true;
    state.calendarMonth = new Date().getMonth();
    state.calendarYear = new Date().getFullYear();
    render();
}

function closeCalendar() {
    state.calendarOpen = false;
    render();
}

function changeMonth(delta) {
    state.calendarMonth += delta;
    if (state.calendarMonth > 11) {
        state.calendarMonth = 0;
        state.calendarYear++;
    } else if (state.calendarMonth < 0) {
        state.calendarMonth = 11;
        state.calendarYear--;
    }
    render();
}

function selectDate(year, month, day) {
    const date = new Date(year, month, day);
    state.dateFilter = date;
    filterVacanciesByDate();
    closeCalendar();
    showModal('success', 'Filtro aplicado', `Mostrando vacantes del ${day}/${month + 1}/${year}`);
}

function clearDateFilter() {
    state.dateFilter = null;
    state.filteredVacancies = [...state.vacancies];
    closeCalendar();
    render();
    showModal('info', 'Filtro eliminado', 'Mostrando todas las vacantes');
}

function filterVacanciesByDate() {
    if (!state.dateFilter) {
        state.filteredVacancies = [...state.vacancies];
        return;
    }
    const filterDate = state.dateFilter.toLocaleDateString('es-MX');
    state.filteredVacancies = state.vacancies.filter(v => {
        if (!v.publication_date) return false;
        const vacDate = new Date(v.created_at).toLocaleDateString('es-MX');
        return vacDate === filterDate;
    });
    render();
}

function renderCalendar() {
    if (!state.calendarOpen) return '';
    
    const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const firstDay = new Date(state.calendarYear, state.calendarMonth, 1).getDay();
    const daysInMonth = new Date(state.calendarYear, state.calendarMonth + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getMonth() === state.calendarMonth && today.getFullYear() === state.calendarYear;
    
    let calendarHTML = `
        <div class="modal-overlay" onclick="if(event.target === this) closeCalendar()">
            <div class="calendar-modal">
                <div class="calendar-header">
                    <h3><i class="fas fa-calendar-alt mr-2"></i>${monthNames[state.calendarMonth]} ${state.calendarYear}</h3>
                    <div class="calendar-nav">
                        <button onclick="changeMonth(-1)"><i class="fas fa-chevron-left"></i></button>
                        <button onclick="changeMonth(1)"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="calendar-grid">
                    <div class="calendar-day header">D</div>
                    <div class="calendar-day header">L</div>
                    <div class="calendar-day header">M</div>
                    <div class="calendar-day header">M</div>
                    <div class="calendar-day header">J</div>
                    <div class="calendar-day header">V</div>
                    <div class="calendar-day header">S</div>
    `;
    
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="calendar-day"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = isCurrentMonth && day === today.getDate();
        const isSelected = state.dateFilter &&
            state.dateFilter.getDate() === day &&
            state.dateFilter.getMonth() === state.calendarMonth &&
            state.dateFilter.getFullYear() === state.calendarYear;
        
        calendarHTML += `<div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" onclick="selectDate(${state.calendarYear}, ${state.calendarMonth}, ${day})">${day}</div>`;
    }
    
    calendarHTML += `
                </div>
                <div class="calendar-actions">
                    <button class="btn btn-cancel" onclick="clearDateFilter()"><i class="fas fa-times"></i> Limpiar</button>
                    <button class="btn btn-primary" onclick="closeCalendar()"><i class="fas fa-check"></i> Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    return calendarHTML;
}

// ==================== RESETEO COMPLETO ====================
function resetCompleteState() {
    console.log('🔄 Reseteando estado completo...');
    state.user = null;
    state.isGuest = false;
    state.view = 'login';
    state.vacancies = [];
    state.filteredVacancies = [];
    state.dateFilter = null;
    state.editingVacancy = null;
    state.showPassword = false;
    state.showConfirmPassword = false;
    state.menuOpen = false;
    state.acceptedTerms = false;
    state.loading = false;
    state.isRendering = false; // CRITICAL: always unlock render cycle
    state.isLoggingOut = false;
    resetAuthForm();
    resetJobForm();
    clearAIData();
}

// ==================== EXPONER FUNCIONES GLOBALES PARA CALENDARIO ====================
window.openCalendar = openCalendar;
window.closeCalendar = closeCalendar;
window.changeMonth = changeMonth;
window.selectDate = selectDate;
window.clearDateFilter = clearDateFilter;

console.log('✅ Config.js cargado correctamente');