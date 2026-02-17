// ==================== RENDER - VISTAS ====================
function renderLogin() {
    return `
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full fade-in">
            <div class="text-center text-white" style="padding:0; background: linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6d28d9 100%);">
                <div class="login-logo-wrap">
                    <img src="https://raw.githubusercontent.com/Compualextech24/empleosdeleongtoaxel/main/logosempleosleonaxel.png"
                         alt="Empleos León GTO"
                         class="login-logo-img"
                         onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
                    <div style="display:none;padding:32px 0 8px;" class="text-6xl">💼</div>
                </div>
                <div style="padding: 0 32px 28px; background: linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6d28d9 100%);">
                    <h1 class="text-3xl font-black mb-2">Empleos León GTO</h1>
                    <p style="color:rgba(233,213,255,0.9); font-size:0.875rem; font-weight:600; letter-spacing:0.05em;">Axellabs Created</p>
                </div>
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
                <h2 class="text-3xl font-black mb-2">Aviso Importante</h2>
                <p class="text-purple-200">Lee con atención antes de continuar</p>
            </div>
            <div class="p-8 space-y-6 max-h-96 overflow-y-auto">
                <div class="space-y-5 text-gray-700 text-sm leading-relaxed">

                    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                        <p class="font-bold text-yellow-800 mb-1"><i class="fas fa-exclamation-triangle mr-1"></i> Aviso de Responsabilidad</p>
                        <p class="text-yellow-700">
                            <strong>Empleos León GTO</strong> es una plataforma comunitaria de acceso libre, creada con el propósito de apoyar a las personas de León, Guanajuato, en la búsqueda y difusión de oportunidades de empleo. <strong>No somos una agencia de empleo ni cobramos por ningún servicio.</strong>
                        </p>
                    </div>

                    <h3 class="font-bold text-base text-gray-800">1. Carácter informativo del portal</h3>
                    <p>
                        Las vacantes publicadas en esta plataforma son aportadas directamente por los usuarios, empresas o particulares, de forma voluntaria y sin mediación de esta aplicación. El portal actúa únicamente como un tablón de avisos digital comunitario. <strong>No verificamos, validamos ni garantizamos la veracidad, autenticidad o vigencia de ninguna oferta publicada.</strong>
                    </p>

                    <h3 class="font-bold text-base text-gray-800">2. Recomendaciones de seguridad antes de presentarte</h3>
                    <p>Antes de acudir a cualquier entrevista o proceso de selección, te recomendamos ampliamente:</p>
                    <ul class="list-disc pl-5 space-y-1 text-gray-600">
                        <li>Verificar la existencia y reputación de la empresa por medios oficiales (Google Maps, redes sociales, IMSS, SAT).</li>
                        <li>Confirmar la dirección de la empresa antes de presentarte.</li>
                        <li>Desconfiar de ofertas que soliciten <strong>depósitos de dinero, pagos por "trámites", compra de uniformes o materiales</strong> antes de contratarte.</li>
                        <li>No entregar documentos originales sin haberlos verificado previamente.</li>
                        <li>Informar a un familiar o persona de confianza sobre la cita antes de asistir.</li>
                        <li>Denunciar ante la Profeco o la Secretaría del Trabajo cualquier práctica irregular.</li>
                    </ul>

                    <h3 class="font-bold text-base text-gray-800">3. Responsabilidad del usuario publicador</h3>
                    <p>
                        Toda persona que publique una vacante en esta plataforma es <strong>legalmente responsable</strong> de la veracidad y legalidad de la información proporcionada. Queda estrictamente prohibido publicar ofertas falsas, engañosas, con fines de estafa, tráfico de personas o cualquier actividad ilícita. El incumplimiento podrá ser reportado a las autoridades competentes.
                    </p>

                    <h3 class="font-bold text-base text-gray-800">4. Exención de responsabilidad</h3>
                    <p>
                        <strong>Empleos León GTO</strong> y sus administradores no se hacen responsables por pérdidas económicas, daños personales, fraudes u cualquier perjuicio derivado del uso de la información publicada en esta plataforma. El uso del portal implica la aceptación total de este aviso.
                    </p>

                    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p class="text-blue-800 text-xs">
                            <i class="fas fa-info-circle mr-1"></i>
                            Si detectas una publicación sospechosa o fraudulenta, por favor repórtala a los administradores del portal. Tu seguridad es lo más importante.
                        </p>
                    </div>

                </div>
                <div class="flex items-center gap-3 bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <input type="checkbox" id="accept-terms" ${state.acceptedTerms ? 'checked' : ''} class="w-5 h-5 accent-purple-600">
                    <label for="accept-terms" class="text-sm font-semibold cursor-pointer text-gray-700">
                        He leído y entiendo el aviso de responsabilidad. Acepto los términos de uso de esta plataforma.
                    </label>
                </div>
            </div>
            <div class="p-8 pt-0">
                <button id="accept-btn" class="btn btn-primary w-full" ${!state.acceptedTerms ? 'disabled' : ''}>
                    <i class="fas fa-check"></i> Continuar al Portal
                </button>
            </div>
        </div>
    </div>`;
}

// ==================== PANTALLA DE CATEGORÍAS ====================
function renderCategories() {
    // "Todas" va primero con color púrpura degradado blanco
    // Fábricas y Calzado → color naranja oscuro (no usado antes)
    // El resto respeta los colores ya asignados, ahora aplicados al fondo completo
    const CATEGORIES = [
        { name: 'Todas',                     icon: 'fa-th-list',          color: '#7c3aed', color2: '#a78bfa', textColor: '#ffffff', iconBg: 'rgba(255,255,255,0.25)' },
        { name: 'Fábricas y Calzado',        icon: 'fa-industry',         color: '#b45309', color2: '#d97706', textColor: '#ffffff', iconBg: 'rgba(255,255,255,0.25)' },
        { name: 'Tiendas y Ventas',          icon: 'fa-shopping-cart',    color: '#be185d', color2: '#ec4899', textColor: '#ffffff', iconBg: 'rgba(255,255,255,0.25)' },
        { name: 'Hospitales y Salud',        icon: 'fa-heartbeat',        color: '#b91c1c', color2: '#ef4444', textColor: '#ffffff', iconBg: 'rgba(255,255,255,0.25)' },
        { name: 'Hoteles y Restaurantes',    icon: 'fa-utensils',         color: '#c2410c', color2: '#f97316', textColor: '#ffffff', iconBg: 'rgba(255,255,255,0.25)' },
        { name: 'Bodegas y Transporte',      icon: 'fa-truck',            color: '#a16207', color2: '#eab308', textColor: '#ffffff', iconBg: 'rgba(255,255,255,0.25)' },
        { name: 'Oficinas y Administración', icon: 'fa-building',         color: '#1d4ed8', color2: '#3b82f6', textColor: '#ffffff', iconBg: 'rgba(255,255,255,0.25)' },
        { name: 'Obra y Construcción',       icon: 'fa-hard-hat',         color: '#57534e', color2: '#78716c', textColor: '#ffffff', iconBg: 'rgba(255,255,255,0.25)' },
        { name: 'Escuelas y Clases',         icon: 'fa-graduation-cap',   color: '#065f46', color2: '#10b981', textColor: '#ffffff', iconBg: 'rgba(255,255,255,0.25)' },
        { name: 'Sistemas y Computación',    icon: 'fa-laptop-code',      color: '#0e7490', color2: '#06b6d4', textColor: '#ffffff', iconBg: 'rgba(255,255,255,0.25)' },
        { name: 'Leyes y Consultas',         icon: 'fa-balance-scale',    color: '#4338ca', color2: '#6366f1', textColor: '#ffffff', iconBg: 'rgba(255,255,255,0.25)' },
        { name: 'Bancos y Contabilidad',     icon: 'fa-coins',            color: '#3f6212', color2: '#84cc16', textColor: '#ffffff', iconBg: 'rgba(255,255,255,0.25)' },
        { name: 'Mantenimiento y Limpieza',  icon: 'fa-broom',            color: '#0f766e', color2: '#14b8a6', textColor: '#ffffff', iconBg: 'rgba(255,255,255,0.25)' },
    ];

    const totalVacancies = state.vacancies.length;

    return `
    <div class="categories-screen-bg">
        <header class="bg-white shadow-lg sticky top-0 z-50 top-header">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="header-title-block">
                            <h1 class="text-2xl font-black">Empleos León GTO</h1>
                            <p class="text-sm">${totalVacancies} vacante${totalVacancies !== 1 ? 's' : ''} disponible${totalVacancies !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        ${state.isGuest ? `
                            <span class="guest-badge" style="font-size:11px;padding:5px 9px;"><i class="fas fa-user"></i> Invitado</span>
                            <button id="go-login" class="btn btn-outline" style="padding:7px 10px;font-size:12px;"><i class="fas fa-sign-in-alt"></i> Sesión</button>
                        ` : state.user ? `
                            <button id="new-vacancy" class="btn btn-new-vacancy" style="padding:7px 11px;font-size:12px;"><i class="fas fa-plus"></i> Nueva</button>
                            <button id="user-menu" class="btn btn-secondary" style="padding:7px 10px;font-size:12px;width:36px;height:36px;"><i class="fas fa-user"></i></button>
                            ${state.menuOpen ? `
                                <div class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50" style="top:70px;right:16px;position:fixed">
                                    <div class="px-4 py-2 border-b user-session-badge">
                                        <p class="session-label">Sesión activa</p>
                                        <p class="session-email truncate" title="${escapeHtml(state.user.email)}">${escapeHtml(state.user.email)}</p>
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
                            <button id="go-login" class="btn btn-outline" style="padding:7px 10px;font-size:12px;"><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</button>
                        `}
                    </div>
                </div>
            </div>
        </header>

        <!-- Barra de acceso rápido — una sola manita fuera de los botones -->
        <div class="quick-action-bar">
            <span class="quick-action-hand">👉</span>
            <button id="quick-terms-btn" class="quick-btn quick-btn-red">
                <i class="fas fa-file-alt"></i> Leer Términos
            </button>
            <button id="quick-vacancy-btn" class="quick-btn quick-btn-blue">
                <i class="fas fa-plus"></i> Añadir Vacante
            </button>
        </div>

        <main class="max-w-5xl mx-auto px-4 pt-6 pb-10" style="background:#fff;">
            <div class="text-center mb-5 fade-in">
                <h2 class="cat-screen-title">Selecciona una opción</h2>
            </div>

            <div class="categories-grid fade-in">
                ${CATEGORIES.map((cat, idx) => {
                    const isAll = cat.name === 'Todas';
                    const count = isAll ? totalVacancies : state.vacancies.filter(v => v.category === cat.name).length;
                    const countLabel = isAll ? `${count} vacante${count !== 1 ? 's' : ''} totales` : `${count} vacante${count !== 1 ? 's' : ''}`;
                    const shimmerDelay = (idx * 0.45).toFixed(2);
                    return `
                    <button class="category-card-v2 ${isAll ? 'cat-all' : ''}"
                        data-category="${isAll ? '' : escapeHtml(cat.name)}"
                        data-is-all="${isAll}"
                        style="--cat-c1:${cat.color};--cat-c2:${cat.color2};--shimmer-delay:${shimmerDelay}s">
                        <div class="cat-v2-icon-wrap" style="background:${cat.iconBg}">
                            <i class="fas ${cat.icon}"></i>
                        </div>
                        <div class="cat-v2-info">
                            <span class="cat-v2-name">${escapeHtml(cat.name)}</span>
                            <span class="cat-v2-count">${countLabel}</span>
                        </div>
                        <i class="fas fa-chevron-right cat-v2-arrow"></i>
                    </button>`;
                }).join('')}
            </div>

            <!-- Firma con marquee continuo -->
            <div class="app-footer fade-in">
                <span class="app-footer-inner">✨ Created by <strong>Axellabstech</strong> &nbsp;|&nbsp; Empleos León GTO &nbsp;|&nbsp; ✨ Created by <strong>Axellabstech</strong> &nbsp;|&nbsp; Empleos León GTO</span>
            </div>
        </main>
    </div>`;
}

function renderDashboard() {
    // Filter by selected category if set
    const baseVacancies = state.selectedCategory
        ? state.vacancies.filter(v => v.category === state.selectedCategory)
        : state.vacancies;
    const displayVacancies = state.dateFilter
        ? (() => {
            const filterDate = state.dateFilter.toLocaleDateString('es-MX');
            return baseVacancies.filter(v => {
                if (!v.created_at) return false;
                return new Date(v.created_at).toLocaleDateString('es-MX') === filterDate;
            });
          })()
        : baseVacancies;

    const userVacancies = state.user ? displayVacancies.filter(v => v.user_id === state.user.id) : [];
    const otherVacancies = state.user ? displayVacancies.filter(v => v.user_id !== state.user.id) : displayVacancies;
    
    return `
    <div class="min-h-screen">
        <header class="bg-white shadow-lg sticky top-0 z-50 top-header">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <button id="back-categories" class="btn-back" title="Volver a categorías">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <div class="header-title-block">
                            <h1 class="text-xl font-black">${state.selectedCategory ? escapeHtml(state.selectedCategory) : 'Todas las Vacantes'}</h1>
                            <p class="text-sm">${displayVacancies.length} vacante${displayVacancies.length !== 1 ? 's' : ''} ${state.dateFilter ? 'filtradas' : 'disponibles'}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        ${state.isGuest ? `
                            <span class="guest-badge" style="font-size:11px;padding:5px 9px;"><i class="fas fa-user"></i> Invitado</span>
                            <button id="go-login" class="btn btn-outline" style="padding:7px 10px;font-size:12px;">Sesión</button>
                        ` : state.user ? `
                            <button id="new-vacancy" class="btn btn-new-vacancy" style="padding:7px 11px;font-size:12px;"><i class="fas fa-plus"></i> Nueva</button>
                            <button id="calendar-btn" class="btn btn-calendar ${state.dateFilter ? 'btn-calendar-active' : ''}" style="padding:7px 10px;font-size:12px;" title="${state.dateFilter ? 'Filtro activo' : 'Filtrar por fecha'}"><i class="fas fa-calendar-alt"></i>${state.dateFilter ? ' ●' : ''}</button>
                            <button id="user-menu" class="btn btn-secondary" style="padding:7px 10px;font-size:12px;width:36px;height:36px;"><i class="fas fa-user"></i></button>
                            ${state.menuOpen ? `
                                <div style="position:fixed;top:70px;right:16px;z-index:9999" class="w-56 bg-white rounded-xl shadow-2xl py-2">
                                    <div class="px-4 py-2 border-b user-session-badge">
                                        <p class="session-label">Sesión activa</p>
                                        <p class="session-email truncate" title="${escapeHtml(state.user.email)}">${escapeHtml(state.user.email)}</p>
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
                            <button id="go-login" class="btn btn-outline" style="padding:7px 10px;font-size:12px;">Iniciar Sesión</button>
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
                    <i class="fas fa-search text-purple-600"></i> ${state.user ? 'Otras Vacantes' : 'Vacantes Disponibles'}
                </h2>
                ${baseVacancies.length === 0 ? `
                    <div class="text-center py-12">
                        <div class="text-6xl mb-4">📭</div>
                        <h3 class="text-xl font-bold text-white">No hay vacantes en esta categoría</h3>
                        ${state.isGuest ? `
                            <p class="text-gray-300 mt-2">Regístrate para publicar la primera vacante</p>
                            <button id="go-signup-from-empty" class="btn btn-primary mt-4"><i class="fas fa-user-plus"></i> Crear Cuenta</button>
                        ` : ''}
                    </div>
                ` : displayVacancies.length === 0 && state.dateFilter ? `
                    <div class="text-center py-12">
                        <div class="text-6xl mb-4">🔍</div>
                        <h3 class="text-xl font-bold text-white">No hay vacantes para esa fecha</h3>
                        <button onclick="clearDateFilter()" class="btn btn-cancel mt-4"><i class="fas fa-times mr-1"></i> Quitar Filtro</button>
                    </div>
                ` : otherVacancies.length === 0 && !state.isGuest ? `
                    <div class="text-center py-12">
                        <div class="text-6xl mb-4">🎉</div>
                        <h3 class="text-xl font-bold text-white">¡Eres el primero! Solo tú has publicado en esta categoría</h3>
                    </div>
                ` : `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${otherVacancies.map(v => renderVacancyCard(v, false)).join('')}
                    </div>
                `}
            </section>
            <!-- Firma con marquee continuo -->
            <div class="app-footer fade-in">
                <span class="app-footer-inner">✨ Created by <strong>Axellabstech</strong> &nbsp;|&nbsp; Empleos León GTO &nbsp;|&nbsp; ✨ Created by <strong>Axellabstech</strong> &nbsp;|&nbsp; Empleos León GTO</span>
            </div>
        </main>
    </div>`;
}

function renderVacancyCard(vacancy, isOwner) {
    const reqLines = vacancy.requirements
        ? vacancy.requirements.split('\n').map(l => l.trim()).filter(l => l.length > 0)
        : [];

    // Only show description if it has real content (not NULL)
    const hasDesc = vacancy.description && vacancy.description !== 'NULL' && vacancy.description.trim().length > 0;
    const hasReqs = reqLines.length > 0 && !(reqLines.length === 1 && reqLines[0] === 'Sin requisitos especificados');

    return `
    <div class="vacancy-card">
        <div class="h-48 bg-gray-200 overflow-hidden">
            ${vacancy.image_base64
                ? `<img src="${vacancy.image_base64}" alt="${escapeHtml(vacancy.company)}" class="w-full h-full object-cover">`
                : '<div class="w-full h-full flex items-center justify-center text-gray-400"><i class="fas fa-image text-3xl"></i></div>'}
        </div>
        <div class="p-6 card-content">
            <h3 class="card-company truncate">${escapeHtml(vacancy.company)}</h3>
            <p class="job-title text-purple-600 mb-3 truncate">${escapeHtml(vacancy.job_title)}</p>
            ${vacancy.category ? `<span class="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mb-3">${escapeHtml(vacancy.category)}</span>` : ''}
            ${hasDesc ? `<p class="card-description">${escapeHtml(vacancy.description)}</p>` : ''}
            ${hasReqs ? `
                <div class="requirements-block ${hasDesc ? 'mt-3' : 'mt-0'} mb-4">
                    <p class="req-block-title"><i class="fas fa-clipboard-list mr-1"></i>Requisitos</p>
                    <ul class="requirements-list">
                        ${reqLines.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            <div class="card-info-rows ${(hasDesc || hasReqs) ? 'mt-3' : ''} mb-4">
                ${vacancy.location      ? `<div class="card-info-row"><i class="fas fa-map-marker-alt"></i><span>${escapeHtml(vacancy.location)}</span></div>` : ''}
                ${vacancy.contact_phone ? `<div class="card-info-row"><i class="fas fa-phone"></i><span>${escapeHtml(vacancy.contact_phone)}</span></div>` : ''}
                ${vacancy.publication_date ? `<div class="card-info-row"><i class="fas fa-calendar"></i><span>${escapeHtml(vacancy.publication_date)}</span></div>` : ''}
                ${vacancy.work_days     ? `<div class="card-info-row"><i class="fas fa-clock"></i><span>${escapeHtml(vacancy.work_days)}</span></div>` : ''}
                ${vacancy.schedule      ? `<div class="card-info-row"><i class="fas fa-business-time"></i><span>${escapeHtml(vacancy.schedule)}</span></div>` : ''}
            </div>
            ${isOwner ? `
                <div class="flex gap-2 mt-auto pt-2">
                    <button data-edit="${vacancy.id}" class="btn btn-edit flex-1"><i class="fas fa-edit"></i> Editar</button>
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
                        </div>
                        <input type="file" accept="image/*" id="img" style="display:none">
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
                        <label>Descripción breve</label>
                        <textarea id="description" rows="3" placeholder="Ej: Se solicita personal para limpieza y acabado de costura...">${escapeHtml(state.formData.description)}</textarea>
                    </div>
                    <div class="input-group">
                        <label>Requisitos <span class="req-hint">— uno por línea, Enter para agregar</span></label>
                        <div class="requirements-textarea-wrap">
                            <textarea id="requirements" rows="5" class="requirements-input" placeholder="Acta de nacimiento&#10;INE&#10;CURP&#10;Carta de no antecedentes penales&#10;Comprobante de domicilio">${escapeHtml(state.formData.requirements)}</textarea>
                            <div class="req-lines-preview" id="req-preview" aria-hidden="true">
                                ${state.formData.requirements
                                    ? state.formData.requirements.split('\n')
                                        .map(l => l.trim())
                                        .filter(l => l.length > 0)
                                        .map(l => `<span class="req-pill">${escapeHtml(l)}</span>`)
                                        .join('')
                                    : '<span class="req-empty-hint">Los requisitos aparecerán aquí</span>'
                                }
                            </div>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Ubicación</label>
                        <input type="text" id="location" placeholder="León, GTO" value="${escapeHtml(state.formData.location)}">
                    </div>
                    <div class="input-group">
                        <label>Categoría</label>
                        <select id="category">
                            <option value="">-- Selecciona una categoría --</option>
                            <option value="Fábricas y Calzado"      ${state.formData.category === 'Fábricas y Calzado'      ? 'selected' : ''}>🏭 Fábricas y Calzado</option>
                            <option value="Tiendas y Ventas"        ${state.formData.category === 'Tiendas y Ventas'        ? 'selected' : ''}>🛒 Tiendas y Ventas</option>
                            <option value="Hospitales y Salud"      ${state.formData.category === 'Hospitales y Salud'      ? 'selected' : ''}>🏥 Hospitales y Salud</option>
                            <option value="Hoteles y Restaurantes"  ${state.formData.category === 'Hoteles y Restaurantes'  ? 'selected' : ''}>🍽️ Hoteles y Restaurantes</option>
                            <option value="Bodegas y Transporte"    ${state.formData.category === 'Bodegas y Transporte'    ? 'selected' : ''}>🚚 Bodegas y Transporte</option>
                            <option value="Oficinas y Administración" ${state.formData.category === 'Oficinas y Administración' ? 'selected' : ''}>🏢 Oficinas y Administración</option>
                            <option value="Obra y Construcción"     ${state.formData.category === 'Obra y Construcción'     ? 'selected' : ''}>🏗️ Obra y Construcción</option>
                            <option value="Escuelas y Clases"       ${state.formData.category === 'Escuelas y Clases'       ? 'selected' : ''}>📚 Escuelas y Clases</option>
                            <option value="Sistemas y Computación"  ${state.formData.category === 'Sistemas y Computación'  ? 'selected' : ''}>💻 Sistemas y Computación</option>
                            <option value="Leyes y Consultas"       ${state.formData.category === 'Leyes y Consultas'       ? 'selected' : ''}>⚖️ Leyes y Consultas</option>
                            <option value="Bancos y Contabilidad"   ${state.formData.category === 'Bancos y Contabilidad'   ? 'selected' : ''}>🏦 Bancos y Contabilidad</option>
                            <option value="Mantenimiento y Limpieza" ${state.formData.category === 'Mantenimiento y Limpieza' ? 'selected' : ''}>🧹 Mantenimiento y Limpieza</option>
                        </select>
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
                        <!-- Fila 1: Cancelar, Limpiar y Publicar en una sola línea -->
                        <div class="form-main-buttons">
                            <button type="button" id="cancel-btn" class="btn-compact btn-cancel">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="button" id="clean-btn" class="btn-compact btn-clean">
                                <i class="fas fa-eraser"></i> Limpiar
                            </button>
                            <button type="submit" class="btn-compact btn-save" ${state.loading ? 'disabled' : ''}>
                                ${state.loading ? '<i class="fas fa-spinner fa-spin"></i> Guardando...' : (state.editingVacancy ? '<i class="fas fa-edit"></i> Actualizar' : '<i class="fas fa-save"></i> Publicar')}
                            </button>
                        </div>
                        <!-- Fila 2: Botón IA ocupa toda la fila (función premium/admin) -->
                        <button type="button" id="ai-btn" class="btn-compact btn-autofill form-ai-button">
                            <i class="fas fa-robot"></i> IA — Autofill (Solo Administradores)
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
        case 'categories':
            content = renderCategories();
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
        // FIX #7: Toggle sin re-render - manipulamos el DOM directamente
        document.getElementById('toggle-pwd')?.addEventListener('click', () => {
            const pwdInput = document.getElementById('password');
            const icon = document.querySelector('#toggle-pwd i');
            if (!pwdInput) return;
            state.showPassword = !state.showPassword;
            pwdInput.type = state.showPassword ? 'text' : 'password';
            if (icon) {
                icon.className = `fas ${state.showPassword ? 'fa-eye-slash' : 'fa-eye'}`;
            }
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
        // FIX #7: Toggle sin re-render para signup
        document.getElementById('toggle-pwd')?.addEventListener('click', () => {
            const pwdInput = document.getElementById('password');
            const icon = document.querySelector('#toggle-pwd i');
            if (!pwdInput) return;
            state.showPassword = !state.showPassword;
            pwdInput.type = state.showPassword ? 'text' : 'password';
            if (icon) icon.className = `fas ${state.showPassword ? 'fa-eye-slash' : 'fa-eye'}`;
        });
        document.getElementById('toggle-confirm-pwd')?.addEventListener('click', () => {
            const confirmInput = document.getElementById('confirm-password');
            const icon = document.querySelector('#toggle-confirm-pwd i');
            if (!confirmInput) return;
            state.showConfirmPassword = !state.showConfirmPassword;
            confirmInput.type = state.showConfirmPassword ? 'text' : 'password';
            if (icon) icon.className = `fas ${state.showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`;
        });
        document.getElementById('go-login')?.addEventListener('click', () => {
            state.view = 'login';
            render();
        });
    }

    // Terms - FIX #7: checkbox sin re-render, solo habilita/deshabilita el botón
    document.getElementById('accept-terms')?.addEventListener('change', (e) => {
        state.acceptedTerms = e.target.checked;
        const acceptBtn = document.getElementById('accept-btn');
        if (acceptBtn) {
            acceptBtn.disabled = !state.acceptedTerms;
        }
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

    // Categories screen
    document.querySelectorAll('[data-category], [data-is-all]').forEach(btn => {
        btn.addEventListener('click', () => {
            const isAll = btn.dataset.isAll === 'true';
            state.selectedCategory = isAll ? null : btn.dataset.category;
            state.dateFilter = null;
            state.view = 'dashboard';
            render();
        });
    });

    // Botones de acción rápida en pantalla de categorías
    document.getElementById('quick-terms-btn')?.addEventListener('click', () => {
        // Llevar a la vista de términos (ya existe en la app)
        state.view = 'terms';
        render();
    });

    document.getElementById('quick-vacancy-btn')?.addEventListener('click', () => {
        if (state.user) {
            // Usuario logueado → ir directo al formulario
            state.view = 'form';
            resetJobForm();
            clearAIData();
            render();
        } else {
            // Invitado o sin sesión → mostrar modal explicativo con opción de registro
            showModal(
                'question',
                'Necesitas una cuenta',
                'Para publicar vacantes debes iniciar sesión o crear una cuenta gratuita. ¿Deseas registrarte ahora?',
                () => {
                    state.view = 'signup';
                    render();
                }
            );
        }
    });

    // Back to categories button
    document.getElementById('back-categories')?.addEventListener('click', () => {
        state.view = 'categories';
        state.dateFilter = null;
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

        // Fix: clicking the image area triggers the hidden file input
        const imageArea = document.querySelector('.image-upload-area');
        const imgInput = document.getElementById('img');
        if (imageArea && imgInput) {
            imageArea.addEventListener('click', () => imgInput.click());
            imgInput.addEventListener('change', handleImageUpload);
        }

        document.getElementById('company').oninput = (e) => state.formData.company = e.target.value;
        document.getElementById('job_title').oninput = (e) => state.formData.job_title = e.target.value;
        document.getElementById('description').oninput = (e) => state.formData.description = e.target.value;
        document.getElementById('requirements').oninput = (e) => {
            state.formData.requirements = e.target.value;
            // Update live preview
            const preview = document.getElementById('req-preview');
            if (preview) {
                const lines = e.target.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                if (lines.length > 0) {
                    preview.innerHTML = lines.map(l => `<span class="req-pill">${escapeHtml(l)}</span>`).join('');
                } else {
                    preview.innerHTML = '<span class="req-empty-hint">Los requisitos aparecerán aquí</span>';
                }
            }
        };
        document.getElementById('location').oninput = (e) => state.formData.location = e.target.value;
        document.getElementById('category').onchange = (e) => state.formData.category = e.target.value;
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
            state.view = accepted ? 'categories' : 'terms';
            await loadVacancies();
        }
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            console.log('🔐 Auth event:', event);

            // FIX #4: Si hay un loader activo en cualquier evento, limpiarlo para no bloquear
            if (event !== 'INITIAL_SESSION') {
                hideLoading();
            }

            if (state.isLoggingOut && event === 'SIGNED_OUT') {
                console.log('✅ Logout completado - estado ya reseteado');
                state.isLoggingOut = false;
                return;
            }
            if (event === 'SIGNED_OUT' && !state.user) {
                console.log('⏭️ SIGNED_OUT ignorado - ya procesado');
                return;
            }

            // FIX #3: Manejar EMAIL_CONFIRMED y USER_UPDATED (cuando el usuario
            // confirma su correo y Supabase redirige de vuelta a la app)
            if ((event === 'SIGNED_IN' || event === 'EMAIL_CONFIRMED' || event === 'USER_UPDATED') && session?.user) {
                state.user = session.user;
                state.isGuest = false;
                const accepted = localStorage.getItem('terms_accepted_' + session.user.id);
                state.acceptedTerms = !!accepted;
                state.view = accepted ? 'categories' : 'terms';
                await loadVacancies();
                hideLoading();
                render();
                if (event === 'EMAIL_CONFIRMED') {
                    showModal('success', '✅ Correo confirmado', '¡Tu cuenta fue verificada! Has iniciado sesión correctamente.');
                } else if (event === 'SIGNED_IN') {
                    showModal('success', '¡Bienvenido!', 'Has iniciado sesión correctamente');
                }
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
                if (state.view === 'dashboard' || state.view === 'categories') render();
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