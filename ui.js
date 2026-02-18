// ==================== RENDERS ====================
function renderLogin() {
    return `
    <div class="min-h-screen flex items-center justify-center p-4">
        <a href="https://axeltechnology24-cloud.github.io/ecosistematodoleongto/"
           class="back-btn-fixed" title="Volver al inicio">
            <i class="fas fa-arrow-left"></i>
        </a>
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full fade-in">
            <div class="login-header-wrapper">
                <div class="login-logo-wrap">
                    <img src="https://raw.githubusercontent.com/Compualextech24/empleosdeleongtoaxel/main/logosempleosleonaxel.png"
                         alt="Empleos León GTO" class="login-logo-img">
                </div>
                <div class="login-text-wrap">
                    <h1 class="text-3xl font-black mb-2">Empleos León GTO</h1>
                    <p style="color:rgba(233,213,255,0.9); font-size:0.875rem;">Axellabs Created</p>
                </div>
            </div>
            <form id="login-form" class="p-8 space-y-6">
                <div class="input-group">
                    <label>Correo Electrónico</label>
                    <input type="email" id="email" required placeholder="tu@email.com" value="${escapeHtml(state.formData.email)}">
                </div>
                <div class="input-group">
                    <label>Contraseña</label>
                    <input type="password" id="password" required placeholder="••••••••" value="${escapeHtml(state.formData.password)}">
                </div>
                <button type="submit" class="btn btn-primary w-full" ${state.loading ? 'disabled' : ''}>
                    ${state.loading ? '<i class="fas fa-spinner fa-spin"></i> Iniciando...' : '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión'}
                </button>
                <button type="button" id="go-signup" class="btn btn-secondary w-full">
                    <i class="fas fa-user-plus"></i> Registrarse
                </button>
                <div class="text-center">
                    <button type="button" id="guest-btn" class="guest-access-link">
                        <span>👉</span> Continuar como invitado
                    </button>
                </div>
            </form>
        </div>
    </div>`;
}

function renderSignup() {
    return `
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full fade-in">
            <div class="signup-header-purple">
                <button type="button" id="signup-back-btn" class="back-btn-inheader">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="signup-header-content">
                    <div class="text-6xl mb-4">📝</div>
                    <h1 class="text-3xl font-black mb-2">Crear Cuenta</h1>
                    <p class="text-purple-200">Únete al portal</p>
                </div>
            </div>
            <form id="signup-form" class="p-8 space-y-6">
                <div class="input-group">
                    <label>Correo</label>
                    <input type="email" id="email" required placeholder="tu@email.com" value="${escapeHtml(state.formData.email)}">
                </div>
                <div class="input-group">
                    <label>Contraseña</label>
                    <input type="password" id="password" required placeholder="Mínimo 6 caracteres" value="${escapeHtml(state.formData.password)}">
                </div>
                <div class="input-group">
                    <label>Confirmar Contraseña</label>
                    <input type="password" id="confirm-password" required placeholder="Repite tu contraseña" value="${escapeHtml(state.formData.confirmPassword)}">
                </div>
                <button type="submit" class="btn btn-primary w-full">
                    <i class="fas fa-user-plus"></i> Crear Cuenta
                </button>
                <button type="button" id="signup-cancel-btn" class="btn btn-cancel w-full">
                    Cancelar
                </button>
            </form>
        </div>
    </div>`;
}

function renderDashboard() {
    const userVacancies = state.user ? state.filteredVacancies.filter(v => v.user_id === state.user.id) : [];
    const otherVacancies = state.user ? state.filteredVacancies.filter(v => v.user_id !== state.user.id) : state.filteredVacancies;
    
    return `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-black text-gray-800">💼 Vacantes Disponibles</h1>
                        <p class="text-gray-600">${state.filteredVacancies.length} vacantes publicadas</p>
                    </div>
                    ${state.user ? `
                        <div class="flex gap-3">
                            <button id="new-vacancy" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Nueva Vacante
                            </button>
                            <div class="relative">
                                <button id="user-menu" class="btn btn-secondary">
                                    <i class="fas fa-user"></i> ${state.user.email}
                                </button>
                                <div id="user-dropdown" class="dropdown-menu ${state.menuOpen ? 'show' : ''}">
                                    <button id="logout" class="dropdown-item">
                                        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                                    </button>
                                    <button id="delete-account" class="dropdown-item text-red-600">
                                        <i class="fas fa-trash"></i> Eliminar Cuenta
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <button id="go-login" class="btn btn-primary">
                            <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
                        </button>
                    `}
                </div>
            </div>
            
            ${state.user && userVacancies.length > 0 ? `
            <div class="mb-6">
                <h2 class="text-2xl font-bold mb-4">Mis Vacantes</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${userVacancies.map(v => renderVacancyCard(v, true)).join('')}
                </div>
            </div>
            ` : ''}
            
            ${otherVacancies.length > 0 ? `
            <div>
                <h2 class="text-2xl font-bold mb-4">Todas las Vacantes</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${otherVacancies.map(v => renderVacancyCard(v, false)).join('')}
                </div>
            </div>
            ` : '<div class="text-center py-12 text-gray-500">No hay vacantes disponibles</div>'}
        </div>
    </div>`;
}

function renderVacancyCard(vacancy, isOwner) {
    return `
    <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
        ${vacancy.image_base64 ? `
            <div class="h-48 overflow-hidden">
                <img src="${vacancy.image_base64}" alt="${escapeHtml(vacancy.company)}" 
                     class="w-full h-full object-cover">
            </div>
        ` : ''}
        <div class="p-6">
            <h3 class="text-xl font-bold mb-2">${escapeHtml(vacancy.company)}</h3>
            ${vacancy.job_title ? `<p class="text-purple-600 font-semibold mb-2">${escapeHtml(vacancy.job_title)}</p>` : ''}
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">${escapeHtml(vacancy.description)}</p>
            
            <div class="space-y-2 text-sm text-gray-500 mb-4">
                ${vacancy.location ? `<div><i class="fas fa-map-marker-alt"></i> ${escapeHtml(vacancy.location)}</div>` : ''}
                ${vacancy.schedule ? `<div><i class="fas fa-clock"></i> ${escapeHtml(vacancy.schedule)}</div>` : ''}
                ${vacancy.contact_phone ? `<div><i class="fas fa-phone"></i> ${escapeHtml(vacancy.contact_phone)}</div>` : ''}
                ${vacancy.publication_date ? `<div><i class="fas fa-calendar"></i> ${escapeHtml(vacancy.publication_date)}</div>` : ''}
            </div>
            
            ${isOwner ? `
                <div class="flex gap-2">
                    <button data-edit="${vacancy.id}" class="btn btn-primary flex-1">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button data-delete="${vacancy.id}" class="btn btn-danger flex-1">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            ` : ''}
        </div>
    </div>`;
}

function renderForm() {
    const isEditing = !!state.editingVacancy;
    
    return `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-2xl shadow-lg p-8">
                <h1 class="text-3xl font-black mb-6">
                    ${isEditing ? '✏️ Editar Vacante' : '➕ Nueva Vacante'}
                </h1>
                
                <form id="vacancy-form" class="space-y-6">
                    <!-- Imagen -->
                    <div>
                        <label class="block mb-2 font-semibold">Imagen (opcional)</label>
                        <div class="image-upload-area" style="cursor:pointer; border: 2px dashed #d1d5db; border-radius: 12px; padding: 40px; text-align: center; background: #f9fafb;">
                            ${state.formData.imageBase64 ? `
                                <img src="${state.formData.imageBase64}" style="max-height: 200px; margin: 0 auto; border-radius: 8px;">
                            ` : `
                                <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: #9ca3af; margin-bottom: 16px;"></i>
                                <p style="color: #6b7280;">Click para subir una imagen</p>
                            `}
                        </div>
                        <input type="file" id="img" accept="image/*" style="display:none">
                    </div>
                    
                    <!-- Empresa -->
                    <div class="input-group">
                        <label>Empresa *</label>
                        <input type="text" id="company" required placeholder="Nombre de la empresa" 
                               value="${escapeHtml(state.formData.company)}" style="text-transform:uppercase">
                    </div>
                    
                    <!-- Puesto -->
                    <div class="input-group">
                        <label>Puesto de Trabajo</label>
                        <input type="text" id="job_title" placeholder="Ej: Vendedor, Cajero..." 
                               value="${escapeHtml(state.formData.job_title)}">
                    </div>
                    
                    <!-- Descripción -->
                    <div class="input-group">
                        <label>Descripción *</label>
                        <textarea id="description" required placeholder="Describe la vacante..." 
                                  rows="4">${escapeHtml(state.formData.description)}</textarea>
                    </div>
                    
                    <!-- Ubicación -->
                    <div class="input-group">
                        <label>Ubicación</label>
                        <input type="text" id="location" placeholder="León, gto" 
                               value="${escapeHtml(state.formData.location)}">
                    </div>
                    
                    <!-- Teléfono -->
                    <div class="input-group">
                        <label>Teléfono de Contacto</label>
                        <input type="tel" id="contact_phone" placeholder="477-123-4567" 
                               value="${escapeHtml(state.formData.contact_phone)}">
                    </div>
                    
                    <!-- Fecha -->
                    <div class="input-group">
                        <label>Fecha de Publicación * (DD/MM/AAAA)</label>
                        <input type="text" id="publication_date" required placeholder="25/12/2025" 
                               value="${escapeHtml(state.formData.publication_date)}">
                    </div>
                    
                    <!-- Horario -->
                    <div class="input-group">
                        <label>Horario</label>
                        <input type="text" id="schedule" placeholder="9:00 AM - 6:00 PM" 
                               value="${escapeHtml(state.formData.schedule)}">
                    </div>
                    
                    <!-- Días -->
                    <div class="input-group">
                        <label>Días Laborales</label>
                        <input type="text" id="work_days" placeholder="Lunes a Viernes" 
                               value="${escapeHtml(state.formData.work_days)}">
                    </div>
                    
                    <!-- Categoría -->
                    <div class="input-group">
                        <label>Categoría *</label>
                        <select id="category" required>
                            <option value="">Seleccionar...</option>
                            <option value="Ventas" ${state.formData.category === 'Ventas' ? 'selected' : ''}>Ventas</option>
                            <option value="Servicios" ${state.formData.category === 'Servicios' ? 'selected' : ''}>Servicios</option>
                            <option value="Construcción" ${state.formData.category === 'Construcción' ? 'selected' : ''}>Construcción</option>
                            <option value="Tecnología" ${state.formData.category === 'Tecnología' ? 'selected' : ''}>Tecnología</option>
                            <option value="Educación" ${state.formData.category === 'Educación' ? 'selected' : ''}>Educación</option>
                            <option value="Salud" ${state.formData.category === 'Salud' ? 'selected' : ''}>Salud</option>
                            <option value="Otro" ${state.formData.category === 'Otro' ? 'selected' : ''}>Otro</option>
                        </select>
                    </div>
                    
                    <!-- Botones -->
                    <div class="flex gap-4">
                        <button type="submit" class="btn btn-primary flex-1">
                            <i class="fas fa-save"></i> ${isEditing ? 'Actualizar' : 'Publicar'}
                        </button>
                        <button type="button" id="cancel-form" class="btn btn-cancel flex-1">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
}

// ==================== RENDER PRINCIPAL ====================
function render() {
    const app = document.getElementById('app');
    if (!app) return;
    
    let content = '';
    switch (state.view) {
        case 'login':
            content = renderLogin();
            break;
        case 'signup':
            content = renderSignup();
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
    
    app.innerHTML = content;
    attachEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== EVENTOS ====================
function attachEvents() {
    // Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = handleLogin;
        document.getElementById('email').oninput = (e) => state.formData.email = e.target.value;
        document.getElementById('password').oninput = (e) => state.formData.password = e.target.value;
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
        document.getElementById('signup-back-btn')?.addEventListener('click', () => {
            state.view = 'login';
            resetAuthForm();
            render();
        });
        document.getElementById('signup-cancel-btn')?.addEventListener('click', () => {
            state.view = 'login';
            resetAuthForm();
            render();
        });
    }
    
    // Dashboard
    document.getElementById('new-vacancy')?.addEventListener('click', () => {
        state.view = 'form';
        resetJobForm();
        render();
    });
    
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
    
    // Vacancy actions
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
        
        const imageArea = document.querySelector('.image-upload-area');
        const imgInput = document.getElementById('img');
        if (imageArea && imgInput) {
            imageArea.addEventListener('click', () => imgInput.click());
            imgInput.addEventListener('change', handleImageUpload);
        }
        
        // Inputs
        document.getElementById('company').oninput = (e) => state.formData.company = e.target.value.toUpperCase();
        document.getElementById('job_title').oninput = (e) => state.formData.job_title = e.target.value;
        document.getElementById('description').oninput = (e) => state.formData.description = e.target.value;
        document.getElementById('location').oninput = (e) => state.formData.location = e.target.value;
        document.getElementById('contact_phone').oninput = (e) => state.formData.contact_phone = e.target.value;
        document.getElementById('publication_date').oninput = (e) => state.formData.publication_date = e.target.value;
        document.getElementById('schedule').oninput = (e) => state.formData.schedule = e.target.value;
        document.getElementById('work_days').oninput = (e) => state.formData.work_days = e.target.value;
        document.getElementById('category').oninput = (e) => state.formData.category = e.target.value;
        
        document.getElementById('cancel-form')?.addEventListener('click', () => {
            showModal('question', 'Cancelar', '¿Cancelar? Los cambios se perderán', () => {
                state.editingVacancy = null;
                state.view = 'dashboard';
                resetJobForm();
                render();
            });
        });
    }
}

// ==================== INICIALIZACIÓN ====================
async function init() {
    console.log('🚀 Iniciando app...');
    
    try {
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            console.log('🔐 Auth event:', event);
            
            hideLoading();
            
            if ((event === 'SIGNED_IN' || event === 'EMAIL_CONFIRMED') && session?.user) {
                state.user = session.user;
                state.isGuest = false;
                state.view = 'dashboard';
                await loadVacancies();
                render();
                if (event === 'EMAIL_CONFIRMED') {
                    showModal('success', '✅ Correo confirmado', 'Tu cuenta fue verificada');
                } else {
                    showModal('success', '¡Bienvenido!', 'Has iniciado sesión correctamente');
                }
            } else if (event === 'SIGNED_OUT') {
                if (state.user) {
                    resetCompleteState();
                    render();
                }
            }
        });
        
        // Realtime
        supabaseClient
            .channel(ENDPOINTS.TABLES.VACANCIES)
            .on('postgres_changes', { event: '*', schema: 'public', table: ENDPOINTS.TABLES.VACANCIES }, async () => {
                await loadVacancies();
                if (state.view === 'dashboard') render();
            })
            .subscribe();
        
        render();
        console.log('✅ App iniciada');
    } catch (error) {
        console.error('❌ Error init:', error);
        render();
    }
}

// Auto-inicio
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log('✅ UI.js cargado');
