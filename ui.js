// ==================== RENDER - VISTAS ====================
function renderLogin() {
    return `
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full fade-in">
            <div class="bg-gradient-to-br from-purple-600 to-purple-800 p-8 text-center text-white">
                <div class="text-6xl mb-4">💼</div>
                <h1 class="text-3xl font-black mb-2">Empleos León GTO</h1>
                <p class="text-purple-200">Portal de Vacantes</p>
            </div>
            <form id="login-form" class="p-8 space-y-6">
                <div class="input-group">
                    <label>Correo Electrónico</label>
                    <input type="email" id="email" required placeholder="tu@email.com" value="${escapeHtml(state.formData.email)}">
                </div>
                <div class="input-group">
                    <label>Contraseña</label>
                    <input type="${state.showPassword ? 'text' : 'password'}" id="password" required placeholder="••••••••" value="${escapeHtml(state.formData.password)}">
                    <span class="input-icon" id="toggle-pwd">
                        <i class="fas ${state.showPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
                    </span>
                </div>
                <button type="submit" class="btn btn-primary w-full" ${state.loading ? 'disabled' : ''}>
                    ${state.loading ? '<i class="fas fa-spinner fa-spin"></i> Iniciando...' : '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión'}
                </button>
                <div class="text-center space-y-3">
                    <div class="text-sm text-gray-600">
                        ¿No tienes cuenta?
                        <button type="button" id="go-signup" class="text-purple-600 hover:underline font-semibold">Regístrate</button>
                    </div>
                    <div class="flex items-center justify-center">
                        <button type="button" id="guest-btn" class="guest-access-link">
                            <span class="hand-icon">👉</span>
                            <span>Continuar como invitado</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>`;
}

function renderSignup() {
    return `
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full fade-in">
            <div class="bg-gradient-to-br from-purple-600 to-purple-800 p-8 text-center text-white">
                <div class="text-6xl mb-4">📝</div>
                <h1 class="text-3xl font-black mb-2">Crear Cuenta</h1>
                <p class="text-purple-200">Únete al portal</p>
            </div>
            <form id="signup-form" class="p-8 space-y-6">
                <div class="input-group">
                    <label>Correo</label>
                    <input type="email" id="email" required placeholder="tu@email.com" value="${escapeHtml(state.formData.email)}">
                </div>
                <div class="input-group">
                    <label>Contraseña</label>
                    <input type="${state.showPassword ? 'text' : 'password'}" id="password" required placeholder="Mínimo 6 caracteres" value="${escapeHtml(state.formData.password)}">
                    <span class="input-icon" id="toggle-pwd">
                        <i class="fas ${state.showPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
                    </span>
                </div>
                <div class="input-group">
                    <label>Confirmar Contraseña</label>
                    <input type="${state.showConfirmPassword ? 'text' : 'password'}" id="confirm-password" required placeholder="Repite tu contraseña" value="${escapeHtml(state.formData.confirmPassword)}">
                    <span class="input-icon" id="toggle-confirm-pwd">
                        <i class="fas ${state.showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
                    </span>
                </div>
                <button type="submit" class="btn btn-primary w-full" ${state.loading ? 'disabled' : ''}>
                    ${state.loading ? '<i class="fas fa-spinner fa-spin"></i> Creando...' : '<i class="fas fa-user-plus"></i> Crear Cuenta'}
                </button>
                <div class="text-center text-sm">
                    ¿Ya tienes cuenta?
                    <button type="button" id="go-login" class="text-purple-600 hover:underline font-semibold">Inicia Sesión</button>
                </div>
            </form>
        </div>
    </div>`;
}

function renderTerms() {
    return `
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full fade-in">
            <div class="bg-gradient-to-br from-purple-600 to-purple-800 p-8 text-white">
                <h2 class="text-3xl font-black mb-2">Términos y Condiciones</h2>
                <p class="text-purple-200">Lee y acepta para continuar</p>
            </div>
            <div class="p-8 space-y-6 max-h-96 overflow-y-auto">
                <div class="space-y-4 text-gray-700">
                    <h3 class="font-bold text-xl">1. Uso del Portal</h3>
                    <p>Portal para publicar ofertas de empleo en León, Guanajuato.</p>
                    <h3 class="font-bold text-xl">2. Responsabilidad</h3>
                    <p>Los usuarios son responsables de la veracidad de la información.</p>
                </div>
                <div class="flex items-center gap-3 bg-purple-50 p-4 rounded-xl">
                    <input type="checkbox" id="accept-terms" ${state.acceptedTerms ? 'checked' : ''} class="w-5 h-5">
                    <label for="accept-terms" class="text-sm font-semibold cursor-pointer">Acepto los términos</label>
                </div>
            </div>
            <div class="p-8 pt-0">
                <button id="accept-btn" class="btn btn-primary w-full" ${!state.acceptedTerms ? 'disabled' : ''}>
                    <i class="fas fa-check"></i> Continuar
                </button>
            </div>
        </div>
    </div>`;
}

function renderDashboard() {
    const displayVacancies = state.filteredVacancies;
    const userVacancies = state.user ? displayVacancies.filter(v => v.user_id === state.user.id) : [];
    const otherVacancies = state.user ? displayVacancies.filter(v => v.user_id !== state.user.id) : displayVacancies;
    
    return `
    <div class="min-h-screen">
        <header class="bg-white shadow-lg sticky top-0 z-50 top-header">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="text-4xl">💼</div>
                        <div>
                            <h1 class="text-2xl font-black">Empleos León GTO</h1>
                            <p class="text-sm">${displayVacancies.length} vacante${displayVacancies.length !== 1 ? 's' : ''} ${state.dateFilter ? 'filtrada' + (displayVacancies.length !== 1 ? 's' : '') : 'disponible' + (displayVacancies.length !== 1 ? 's' : '')}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        ${state.isGuest ? `
                            <span class="guest-badge"><i class="fas fa-user"></i> Modo Invitado</span>
                            <button id="go-login" class="btn btn-outline">Iniciar Sesión</button>
                        ` : state.user ? `
                            <button id="new-vacancy" class="btn btn-new-vacancy"><i class="fas fa-plus"></i> Nueva</button>
                            <button id="calendar-btn" class="btn btn-calendar">${state.dateFilter ? 'Filtrado' : 'Filtrar'}</button>
                            <button id="user-menu" class="btn btn-secondary"><i class="fas fa-user"></i></button>
                            ${state.menuOpen ? `
                                <div class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50">
                                    <div class="px-4 py-2 border-b">
                                        <p class="text-xs text-gray-500">Sesión</p>
                                        <p class="text-sm font-semibold truncate">${escapeHtml(state.user.email)}</p>
                                    </div>
                                    <button id="logout" class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                                        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                                    </button>
                                    <button id="delete-account" class="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2">
                                        <i class="fas fa-trash"></i> Eliminar Cuenta
                                    </button>
                                </div>
                            ` : ''}
                        ` : `
                            <button id="go-login" class="btn btn-outline">Iniciar Sesión</button>
                        `}
                    </div>
                </div>
            </div>
        </header>
        <main class="max-w-7xl mx-auto px-4 py-8">
            ${userVacancies.length > 0 ? `
                <section class="mb-8">
                    <h2 class="text-2xl font-black mb-6 dashboard-section-title"><i class="fas fa-briefcase text-purple-600"></i> Mis Vacantes</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${userVacancies.map(v => renderVacancyCard(v, true)).join('')}
                    </div>
                </section>
            ` : ''}
            <section>
                <h2 class="text-2xl font-black mb-6 dashboard-section-title">
                    <i class="fas fa-search text-purple-600"></i> ${state.user ? 'Otras Vacantes' : 'Todas las Vacantes'}
                </h2>
                ${state.vacancies.length === 0 ? `
                    <div class="text-center py-12">
                        <div class="text-6xl mb-4">📭</div>
                        <h3 class="text-xl font-bold text-white">No hay vacantes disponibles</h3>
                        ${state.isGuest ? `
                            <p class="text-gray-300 mt-2">Regístrate para publicar la primera vacante</p>
                            <button id="go-signup-from-empty" class="btn btn-primary mt-4">
                                <i class="fas fa-user-plus"></i> Crear Cuenta
                            </button>
                        ` : ''}
                    </div>
                ` : displayVacancies.length === 0 && state.dateFilter ? `
                    <div class="text-center py-12">
                        <div class="text-6xl mb-4">🔍</div>
                        <h3 class="text-xl font-bold text-white">No hay vacantes para la fecha seleccionada</h3>
                        <button onclick="clearDateFilter()" class="btn btn-secondary mt-4">Quitar Filtro</button>
                    </div>
                ` : otherVacancies.length === 0 && !state.isGuest ? `
                    <div class="text-center py-12">
                        <div class="text-6xl mb-4">🎉</div>
                        <h3 class="text-xl font-bold text-white">¡Eres el primero! Solo tú has publicado vacantes</h3>
                    </div>
                ` : `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${otherVacancies.map(v => renderVacancyCard(v, false)).join('')}
                    </div>
                `}
            </section>
        </main>
    </div>`;
}

function renderVacancyCard(vacancy, isOwner) {
    return `
    <div class="vacancy-card">
        <div class="h-48 bg-gray-200 overflow-hidden">
            ${vacancy.image_base64 ? `<img src="${vacancy.image_base64}" alt="${escapeHtml(vacancy.company)}" class="w-full h-full object-cover">` : '<div class="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>'}
        </div>
        <div class="p-6 card-content">
            <h3 class="font-bold mb-2 truncate">${escapeHtml(vacancy.company)}</h3>
            <p class="job-title text-purple-600 mb-3 truncate">${escapeHtml(vacancy.job_title)}</p>
            <p class="text-sm text-gray-600 mb-4 line-clamp-3 description">${escapeHtml(vacancy.description)}</p>
            <div class="space-y-2 mb-4 text-sm text-gray-700">
                ${vacancy.location ? `<div><i class="fas fa-map-marker-alt text-purple-600 mr-2"></i>${escapeHtml(vacancy.location)}</div>` : ''}
                ${vacancy.contact_phone ? `<div><i class="fas fa-phone text-purple-600 mr-2"></i>${escapeHtml(vacancy.contact_phone)}</div>` : ''}
                ${vacancy.publication_date ? `<div><i class="fas fa-calendar text-purple-600 mr-2"></i>${escapeHtml(vacancy.publication_date)}</div>` : ''}
                ${vacancy.work_days ? `<div><i class="fas fa-clock text-purple-600 mr-2"></i>${escapeHtml(vacancy.work_days)}</div>` : ''}
                ${vacancy.schedule ? `<div><i class="fas fa-clock text-purple-600 mr-2"></i>${escapeHtml(vacancy.schedule)}</div>` : ''}
            </div>
            ${isOwner ? `
                <div class="flex gap-2">
                    <button data-edit="${vacancy.id}" class="btn btn-secondary flex-1"><i class="fas fa-edit"></i> Editar</button>
                    <button data-delete="${vacancy.id}" class="btn btn-cancel flex-1"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            ` : ''}
        </div>
    </div>`;
}

function renderForm() {
    return `
    <div class="min-h-screen py-8">
        <div class="max-w-3xl mx-auto px-4">
            <div class="bg-white rounded-3xl shadow-2xl overflow-hidden fade-in">
                <div class="bg-gradient-to-br from-purple-600 to-purple-800 p-8 text-white">
                    <h2 class="text-3xl font-black mb-2">${state.editingVacancy ? 'Editar' : 'Nueva'} Vacante</h2>
                    <p class="text-purple-200">Completa la información</p>
                </div>
                <form id="vacancy-form" class="p-8 space-y-6">
                    <div class="input-group">
                        <label>Imagen *</label>
                        <div class="image-upload-area ${state.formData.imageBase64 ? 'has-image' : ''}">
                            ${state.formData.imageBase64 ? `
                                <div class="image-preview-container">
                                    <img src="${state.formData.imageBase64}" alt="Vista previa">
                                </div>
                            ` : `
                                <div class="text-gray-500">
                                    <i class="fas fa-cloud-upload-alt text-4xl mb-2"></i>
                                    <p>Click para subir imagen</p>
                                    <p class="text-xs">Máx 2MB</p>
                                </div>
                            `}
                            <input type="file" accept="image/*" id="img" class="hidden">
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Empresa</label>
                        <input type="text" id="company" placeholder="Ej: Calzado León" value="${escapeHtml(state.formData.company)}">
                    </div>
                    <div class="input-group">
                        <label>Puesto</label>
                        <input type="text" id="job_title" placeholder="Ej: Desarrollador" value="${escapeHtml(state.formData.job_title)}">
                    </div>
                    <div class="input-group">
                        <label>Descripción</label>
                        <textarea id="description" rows="5" placeholder="Describe el puesto...">${escapeHtml(state.formData.description)}</textarea>
                    </div>
                    <div class="input-group">
                        <label>Ubicación</label>
                        <input type="text" id="location" placeholder="León, GTO" value="${escapeHtml(state.formData.location)}">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="input-group">
                            <label>Teléfono</label>
                            <input type="text" id="contact_phone" placeholder="477-123-4567" value="${escapeHtml(state.formData.contact_phone)}">
                        </div>
                        <div class="input-group">
                            <label>Fecha publicación</label>
                            <textarea id="publication_date" rows="2" placeholder="15 de enero 2025">${escapeHtml(state.formData.publication_date)}</textarea>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Días de trabajo</label>
                        <textarea id="work_days" rows="2" placeholder="Lunes a Viernes">${escapeHtml(state.formData.work_days)}</textarea>
                    </div>
                    <div class="input-group">
                        <label>Horario</label>
                        <textarea id="schedule" rows="2" placeholder="09:00 - 18:00">${escapeHtml(state.formData.schedule)}</textarea>
                    </div>
                    <div class="form-buttons-container">
                        <button type="button" id="cancel-btn" class="btn-compact btn-cancel w-full sm:flex-1">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button type="button" id="clean-btn" class="btn-compact btn-clean w-full sm:flex-1">
                            <i class="fas fa-eraser"></i> Limpiar
                        </button>
                        <button type="button" id="ai-btn" class="btn-compact btn-autofill w-full sm:flex-1">
                            <i class="fas fa-robot"></i> IA
                        </button>
                        <button type="submit" class="btn-compact btn-save w-full sm:flex-1" ${state.loading ? 'disabled' : ''}>
                            ${state.loading ? '<i class="fas fa-spinner fa-spin"></i> Guardando...' : (state.editingVacancy ? '<i class="fas fa-edit"></i> Actualizar' : '<i class="fas fa-save"></i> Publicar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        ${state.aiChatOpen ? renderAIChat() : ''}
    </div>`;
}

function renderAIChat() {
    return `
    <div class="ai-chat-modal ${state.chatMinimized ? 'minimized' : ''}">
        <div class="ai-chat-header" id="ai-header">
            <h3><i class="fas fa-robot mr-2"></i>Autofill IA</h3>
            <div class="flex items-center gap-2">
                <button class="close-btn" id="minimize-ai"><i class="fas fa-minus"></i></button>
                <button class="close-btn" id="close-ai"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <div class="ai-chat-messages">
            ${state.aiMessages.map(m => `
                <div class="ai-message ${m.role}">
                    ${escapeHtml(m.content)}
                </div>
            `).join('')}
            ${state.aiLoading ? '<div class="ai-message bot"><span class="ai-loading"></span> Procesando...</div>' : ''}
        </div>
        <div class="ai-chat-input">
            <div class="file-upload">
                <label>
                    <i class="fas fa-paperclip mr-1"></i> Imagen
                    <input type="file" accept="image/*" id="ai-img">
                </label>
                ${state.aiImagePreview ? `
                    <div class="file-preview">
                        <img src="${state.aiImagePreview}" alt="Preview">
                        <button id="remove-ai-img" class="remove-file">×</button>
                    </div>
                ` : ''}
            </div>
            <textarea id="ai-chat-input" placeholder="Describe la vacante..." rows="3"></textarea>
            <div class="ai-chat-actions">
                <button id="send-ai" class="btn-send" ${state.aiLoading ? 'disabled' : ''}>
                    <i class="fas fa-paper-plane"></i> Enviar
                </button>
                <button id="start-ai" class="btn-start" ${!state.aiExtractedData || state.aiLoading ? 'disabled' : ''}>
                    <i class="fas fa-play"></i> START
                </button>
                <button id="close-ai-2" class="btn-close-chat">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
        </div>
    </div>`;
}

// ==================== RENDER PRINCIPAL ====================
function render() {
    if (state.isRendering) {
        console.log('⏸️ Render ya en progreso, saltando...');
        return;
    }
    state.isRendering = true;
    const app = document.getElementById('app');
    if (!app) {
        state.isRendering = false;
        return;
    }
    let content = '';
    switch (state.view) {
        case 'login':
            content = renderLogin();
            break;
        case 'signup':
            content = renderSignup();
            break;
        case 'terms':
            content = renderTerms();
            break;
        case 'dashboard':
            content = renderDashboard();
            break;
        case 'form':
            content = renderForm();
            break;
        default:
            content = renderLogin();
    }
    app.innerHTML = content + renderCalendar();
    attachEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    state.isRendering = false;
}

// ==================== EVENTOS ====================
function attachEvents() {
    // Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = handleLogin;
        document.getElementById('email').oninput = (e) => state.formData.email = e.target.value;
        document.getElementById('password').oninput = (e) => state.formData.password = e.target.value;
        document.getElementById('toggle-pwd')?.addEventListener('click', () => {
            state.showPassword = !state.showPassword;
            render();
        });
        document.getElementById('go-signup')?.addEventListener('click', () => {
            state.view = 'signup';
            resetAuthForm();
            render();
        });
        document.getElementById('guest-btn')?.addEventListener('click', handleGuestAccess);
    }

    // Signup
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.onsubmit = handleSignup;
        document.getElementById('email').oninput = (e) => state.formData.email = e.target.value;
        document.getElementById('password').oninput = (e) => state.formData.password = e.target.value;
        document.getElementById('confirm-password').oninput = (e) => state.formData.confirmPassword = e.target.value;
        document.getElementById('toggle-pwd')?.addEventListener('click', () => {
            state.showPassword = !state.showPassword;
            render();
        });
        document.getElementById('toggle-confirm-pwd')?.addEventListener('click', () => {
            state.showConfirmPassword = !state.showConfirmPassword;
            render();
        });
        document.getElementById('go-login')?.addEventListener('click', () => {
            state.view = 'login';
            render();
        });
    }

    // Terms
    document.getElementById('accept-terms')?.addEventListener('change', (e) => {
        state.acceptedTerms = e.target.checked;
        render();
    });
    document.getElementById('accept-btn')?.addEventListener('click', handleAcceptTerms);

    // Dashboard
    document.getElementById('new-vacancy')?.addEventListener('click', () => {
        state.view = 'form';
        resetJobForm();
        clearAIData();
        render();
    });
    document.getElementById('calendar-btn')?.addEventListener('click', openCalendar);
    document.getElementById('user-menu')?.addEventListener('click', () => {
        state.menuOpen = !state.menuOpen;
        render();
    });
    document.getElementById('logout')?.addEventListener('click', handleLogout);
    document.getElementById('delete-account')?.addEventListener('click', handleDeleteAccount);
    document.getElementById('go-login')?.addEventListener('click', () => {
        state.view = 'login';
        render();
    });
    document.getElementById('go-signup-from-empty')?.addEventListener('click', () => {
        state.view = 'signup';
        render();
    });

    // Vacancy cards
    document.querySelectorAll('[data-edit]').forEach(btn => {
        btn.addEventListener('click', () => handleEditVacancy(btn.dataset.edit));
    });
    document.querySelectorAll('[data-delete]').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteVacancy(btn.dataset.delete));
    });

    // Form
    const vacancyForm = document.getElementById('vacancy-form');
    if (vacancyForm) {
        vacancyForm.onsubmit = handleSaveVacancy;
        document.getElementById('img').onchange = handleImageUpload;
        document.getElementById('company').oninput = (e) => state.formData.company = e.target.value;
        document.getElementById('job_title').oninput = (e) => state.formData.job_title = e.target.value;
        document.getElementById('description').oninput = (e) => state.formData.description = e.target.value;
        document.getElementById('location').oninput = (e) => state.formData.location = e.target.value;
        document.getElementById('contact_phone').oninput = (e) => state.formData.contact_phone = e.target.value;
        document.getElementById('publication_date').oninput = (e) => state.formData.publication_date = e.target.value;
        document.getElementById('work_days').oninput = (e) => state.formData.work_days = e.target.value;
        document.getElementById('schedule').oninput = (e) => state.formData.schedule = e.target.value;
        document.getElementById('cancel-btn')?.addEventListener('click', cancelForm);
        document.getElementById('clean-btn')?.addEventListener('click', cleanForm);
        document.getElementById('ai-btn')?.addEventListener('click', toggleAIChat);
    }

    // AI Chat
    document.getElementById('ai-chat-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendAIMessage();
        }
    });
    document.getElementById('send-ai')?.addEventListener('click', sendAIMessage);
    document.getElementById('start-ai')?.addEventListener('click', startAutofill);
    document.getElementById('close-ai')?.addEventListener('click', () => {
        state.aiChatOpen = false;
        clearAIData();
        render();
    });
    document.getElementById('close-ai-2')?.addEventListener('click', () => {
        state.aiChatOpen = false;
        clearAIData();
        render();
    });
    document.getElementById('minimize-ai')?.addEventListener('click', () => {
        state.chatMinimized = !state.chatMinimized;
        render();
    });
    document.getElementById('ai-img')?.addEventListener('change', handleAIImageUpload);
    document.getElementById('remove-ai-img')?.addEventListener('click', removeAIImage);
}

// ==================== INICIALIZACIÓN ====================
async function init() {
    console.log('🚀 Inicializando...');
    try {
        const { data } = await supabaseClient.auth.getSession();
        if (data?.session?.user) {
            state.user = data.session.user;
            const accepted = localStorage.getItem('terms_accepted_' + data.session.user.id);
            state.acceptedTerms = !!accepted;
            state.view = accepted ? 'dashboard' : 'terms';
            await loadVacancies();
        }
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            console.log('🔐 Auth:', event);
            if (state.isLoggingOut && event === 'SIGNED_OUT') {
                console.log('✅ Logout completado - estado ya reseteado');
                return;
            }
            if (event === 'SIGNED_OUT' && !state.user) {
                console.log('⏭️ SIGNED_OUT ignorado - ya procesado');
                return;
            }
            if (event === 'SIGNED_IN' && session?.user) {
                state.user = session.user;
                state.isGuest = false;
                const accepted = localStorage.getItem('terms_accepted_' + session.user.id);
                state.acceptedTerms = !!accepted;
                state.view = accepted ? 'dashboard' : 'terms';
                await loadVacancies();
                hideLoading();
                render();
                showModal('success', '¡Bienvenido!', 'Has iniciado sesión correctamente');
            } else if (event === 'SIGNED_OUT' && state.user && !state.isLoggingOut) {
                console.log('🔄 SIGNED_OUT inesperado detectado - reseteando estado');
                resetCompleteState();
                render();
            }
        });
        supabaseClient
            .channel(ENDPOINTS.CHANNELS.VACANCIES)
            .on('postgres_changes', { event: '*', schema: 'public', table: ENDPOINTS.TABLES.VACANCIES }, async () => {
                await loadVacancies();
                if (state.view === 'dashboard') render();
            })
            .subscribe();
        render();
        console.log('✅ Listo');
    } catch (error) {
        console.error('❌ Error init:', error);
        render();
    }
}

// ==================== AUTO-INICIO ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}