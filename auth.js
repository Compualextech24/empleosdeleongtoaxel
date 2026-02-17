// ==================== AUTENTICACIÓN ====================
async function handleLogin(e) {
    e.preventDefault();
    if (state.loading) return;
    const email = state.formData.email?.trim();
    const password = state.formData.password;
    if (!email || !password) {
        showModal('error', 'Error', 'Correo y contraseña son requeridos');
        return;
    }
    showLoading();
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data || !data.user) throw new Error('No se recibió información del usuario');
        console.log('✅ Login exitoso');
    } catch (error) {
        console.error('❌ Error login:', error);
        // FIX #2: Siempre mostrar mensaje en español, sin importar el error de Supabase
        showModal('error', 'Credenciales incorrectas', 'Correo o contraseña incorrectos. Por favor valida tu información.');
        hideLoading();
    }
}

async function handleSignup(e) {
    e.preventDefault();
    if (state.loading) return;
    if (state.formData.password !== state.formData.confirmPassword) {
        showModal('error', 'Error', 'Las contraseñas no coinciden');
        return;
    }
    if (state.formData.password.length < 6) {
        showModal('error', 'Error', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }
    showLoading();
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: state.formData.email.trim().toLowerCase(),
            password: state.formData.password,
            options: { emailRedirectTo: ENDPOINTS.SUPABASE_REDIRECT_URL }
        });
        if (error) throw error;
        // FIX #3: Modal claro explicando que se envió correo de confirmación
        hideLoading();
        showModal('info', '📧 Revisa tu correo', `Se envió un enlace de confirmación a:\n${state.formData.email.trim().toLowerCase()}\n\nHaz clic en ese enlace para activar tu cuenta y luego inicia sesión normalmente. Si no lo ves, revisa tu carpeta de Spam.`);
        state.view = 'login';
        resetAuthForm();
        render();
    } catch (error) {
        console.error('❌ Error signup:', error);
        showModal('error', 'Error de registro', error.message || 'No se pudo crear la cuenta. Intenta de nuevo.');
        hideLoading();
    }
}

async function handleLogout() {
    if (state.isLoggingOut) {
        console.log('⏸️ Ya hay un logout en proceso');
        return;
    }
    // FIX #1: header rojo para acción destructiva
    // FIX #4: reset de estado ANTES de signOut para evitar spinner bloqueante
    showModal('question-danger', 'Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', async () => {
        console.log('🚪 Cerrando sesión...');
        state.isLoggingOut = true;

        // FIX #4: Primero reseteamos el estado y renderizamos login,
        // luego llamamos signOut en background para no quedar atascados si falla
        resetCompleteState();
        render();

        try {
            await supabaseClient.auth.signOut();
            console.log('✅ Sesión cerrada exitosamente');
        } catch (error) {
            console.error('❌ Error logout (no crítico, ya se reseteó el estado):', error);
            // El estado ya fue reseteado, la UI ya muestra el login, no bloqueamos al usuario
        }
    });
}

async function handleDeleteAccount() {
    // FIX #1: header rojo para acción destructiva
    showModal('question-danger', 'Eliminar cuenta', '¿ELIMINAR tu cuenta y TODAS tus vacantes? Esta acción no se puede deshacer.', async () => {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-window">
                <div class="modal-header modal-header-error">
                    <i class="fas fa-exclamation-triangle" style="color:#ef4444"></i>
                    <div class="header-text">
                        <h3>Confirmación final</h3>
                    </div>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom:12px">Escribe <strong>ELIMINAR</strong> para confirmar:</p>
                    <input type="text" id="delete-confirm-input" style="width:100%;padding:10px;border:2px solid #e5e7eb;border-radius:6px;font-size:14px" placeholder="ELIMINAR">
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                    <button class="btn btn-primary" style="background:#ef4444" id="confirm-delete-btn">Eliminar</button>
                </div>
            </div>
        `;
        document.getElementById('modal-root').appendChild(modal);
        
        document.getElementById('confirm-delete-btn').onclick = async () => {
            const input = document.getElementById('delete-confirm-input').value;
            if (input !== 'ELIMINAR') {
                showModal('error', 'Error', 'Debes escribir ELIMINAR para confirmar');
                return;
            }
            modal.remove();
            showLoading();
            try {
                const { data: userVacancies } = await supabaseClient
                    .from(ENDPOINTS.TABLES.VACANCIES)
                    .select('id')
                    .eq('user_id', state.user.id);
                if (userVacancies?.length > 0) {
                    for (const v of userVacancies) {
                        await supabaseClient.from(ENDPOINTS.TABLES.VACANCIES).delete().eq('id', v.id);
                    }
                }
                if (state.user?.id) {
                    localStorage.removeItem('terms_accepted_' + state.user.id);
                }
                showModal('success', '¡Eliminado!', 'Tus vacantes han sido eliminadas');
                setTimeout(() => handleLogout(), 2000);
            } catch (error) {
                console.error('❌ Error delete:', error);
                showModal('error', 'Error', 'No se pudo eliminar la cuenta');
            } finally {
                hideLoading();
            }
        };
    });
}

async function handleGuestAccess() {
    console.log('👤 Acceso como invitado...');
    showLoading();
    try {
        state.isGuest = true;
        state.view = 'categories';
        await loadVacancies();
        console.log('✅ Acceso invitado exitoso. Vacantes cargadas:', state.vacancies.length);
        render();
        showModal('info', '¡Bienvenido!', 'Estás navegando como invitado. Podrás ver todas las vacantes pero no publicar.');
    } catch (error) {
        console.error('❌ Error acceso invitado:', error);
        showModal('error', 'Error', 'No se pudo cargar las vacantes');
        state.isGuest = false;
        state.view = 'login';
        render();
    } finally {
        hideLoading();
    }
}

function handleAcceptTerms() {
    if (!state.acceptedTerms) {
        showModal('warning', 'Términos requeridos', 'Debes aceptar los términos');
        return;
    }
    if (state.user) {
        localStorage.setItem('terms_accepted_' + state.user.id, 'true');
    }
    state.view = 'categories';
    render();
}

// ==================== VACANTES ====================
async function loadVacancies() {
    console.log('📥 Cargando vacantes...');
    try {
        const { data, error } = await supabaseClient
            .from(ENDPOINTS.TABLES.VACANCIES)
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        state.vacancies = data || [];
        state.filteredVacancies = [...state.vacancies];
        if (state.dateFilter) {
            filterVacanciesByDate();
        }
        console.log('✅ Vacantes cargadas:', state.vacancies.length);
    } catch (error) {
        console.error('❌ Error loading vacancies:', error);
        state.vacancies = [];
        state.filteredVacancies = [];
    }
}

async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        showModal('error', 'Archivo muy grande', 'Máximo 2MB');
        e.target.value = '';
        return;
    }
    if (!file.type.startsWith('image/')) {
        showModal('error', 'Tipo inválido', 'Solo imágenes');
        e.target.value = '';
        return;
    }
    try {
        const reader = new FileReader();
        reader.onload = (ev) => {
            state.formData.imageBase64 = ev.target.result;
            render();
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('❌ Error reading image:', error);
        showModal('error', 'Error', 'No se pudo leer la imagen');
        e.target.value = '';
    }
}

async function handleSaveVacancy(e) {
    e.preventDefault();
    if (state.loading) return;
    if (!state.formData.imageBase64) {
        showModal('error', 'Imagen requerida', 'Debes subir al menos una imagen para publicar la vacante.');
        return;
    }
    if (!state.user?.id) {
        showModal('error', 'Sesión requerida', 'Inicia sesión para publicar');
        return;
    }

    // Verificar si hay otros datos además de la imagen
    const hasOtherData = (
        state.formData.company?.trim() ||
        state.formData.job_title?.trim() ||
        state.formData.description?.trim() ||
        state.formData.requirements?.trim() ||
        state.formData.location?.trim() ||
        state.formData.contact_phone?.trim() ||
        state.formData.publication_date?.trim() ||
        state.formData.schedule?.trim() ||
        state.formData.work_days?.trim() ||
        state.formData.category?.trim()
    );

    if (!hasOtherData) {
        // Solo hay imagen — pedir confirmación
        showModal(
            'question',
            '¿Solo imagen de referencia?',
            'Detectamos que únicamente has subido una imagen sin completar otros datos (empresa, puesto, descripción, etc.). ¿Deseas publicar la vacante únicamente con la imagen de referencia? Te recomendamos agregar al menos el nombre de empresa y el puesto.',
            () => proceedSaveVacancy()
        );
        return;
    }

    proceedSaveVacancy();
}

async function proceedSaveVacancy() {
    if (state.loading) return;
    showLoading();
    try {
        const vacancyData = {
            user_id: state.user.id,
            company: state.formData.company?.trim() || 'SIN INFORMACIÓN',
            job_title: state.formData.job_title?.trim() || 'SIN INFORMACIÓN',
            description: state.formData.description?.trim() || 'SIN INFORMACIÓN',
            requirements: state.formData.requirements?.trim() || null,
            location: state.formData.location?.trim() || null,
            contact_phone: state.formData.contact_phone?.trim() || null,
            publication_date: state.formData.publication_date?.trim() || null,
            schedule: state.formData.schedule?.trim() || null,
            work_days: state.formData.work_days?.trim() || null,
            category: state.formData.category?.trim() || null,
            image_base64: state.formData.imageBase64
        };
        let result;
        if (state.editingVacancy) {
            result = await supabaseClient
                .from(ENDPOINTS.TABLES.VACANCIES)
                .update(vacancyData)
                .eq('id', state.editingVacancy.id);
        } else {
            result = await supabaseClient
                .from(ENDPOINTS.TABLES.VACANCIES)
                .insert([vacancyData]);
        }
        if (result.error) throw result.error;
        const wasEditing = !!state.editingVacancy;
        state.editingVacancy = null;
        resetJobForm();
        clearAIData();
        await loadVacancies();
        state.view = 'dashboard';
        render();
        showModal('success', '¡Éxito!', wasEditing ? 'Vacante actualizada' : 'Vacante publicada');
    } catch (error) {
        console.error('❌ Error saving:', error);
        showModal('error', 'Error', error.message || 'No se pudo guardar');
    } finally {
        hideLoading();
    }
}

async function handleDeleteVacancy(vacancyId) {
    const vacancy = state.vacancies.find(v => v.id === vacancyId);
    if (!vacancy) return;
    showModal('question', 'Eliminar vacante', `¿Eliminar vacante de ${vacancy.company}?`, async () => {
        showLoading();
        try {
            const { error } = await supabaseClient.from(ENDPOINTS.TABLES.VACANCIES).delete().eq('id', vacancy.id);
            if (error) throw error;
            await loadVacancies();
            render();
            showModal('success', '¡Eliminado!', 'Vacante eliminada');
        } catch (error) {
            console.error('❌ Error delete vacancy:', error);
            showModal('error', 'Error', 'No se pudo eliminar');
        } finally {
            hideLoading();
        }
    });
}

function handleEditVacancy(vacancyId) {
    const vacancy = state.vacancies.find(v => v.id === vacancyId);
    if (!vacancy) return;
    state.editingVacancy = vacancy;
    state.formData = {
        company: vacancy.company || '',
        job_title: vacancy.job_title || '',
        description: vacancy.description || '',
        requirements: vacancy.requirements || '',
        location: vacancy.location || '',
        contact_phone: vacancy.contact_phone || '',
        publication_date: vacancy.publication_date || '',
        schedule: vacancy.schedule || '',
        work_days: vacancy.work_days || '',
        category: vacancy.category || '',
        imageBase64: vacancy.image_base64 || '',
        email: '',
        password: '',
        confirmPassword: ''
    };
    clearAIData();
    state.view = 'form';
    render();
}

// ==================== IA ====================
async function sendAIMessage() {
    // Double-check admin access
    if (!isAIAdmin()) {
        showAIAccessDeniedModal();
        return;
    }
    const input = document.getElementById('ai-chat-input');
    const message = input?.value.trim();
    if (!message && !state.aiImage) {
        showModal('info', 'Mensaje vacío', 'Escribe algo o sube una imagen');
        return;
    }
    if (message) {
        state.aiMessages.push({ role: 'user', content: message });
    }
    state.aiLoading = true;
    render();
    try {
        const requestData = { text: message || '' };
        if (state.aiImage) {
            const reader = new FileReader();
            const base64 = await new Promise((resolve, reject) => {
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = () => reject(new Error('Error al leer imagen'));
                reader.readAsDataURL(state.aiImage);
            });
            requestData.image = base64;
        }
        const response = await fetch(EndpointHelpers.getAIExtractUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ENDPOINTS.SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify(requestData)
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        const data = await response.json();
        state.aiMessages.push({
            role: 'bot',
            content: data.message || 'Datos procesados. Presiona START para llenar el formulario. ✅'
        });
        if (data.formData) {
            state.aiExtractedData = data.formData;
        }
    } catch (error) {
        console.error('❌ Error IA:', error);
        state.aiMessages.push({
            role: 'bot',
            content: `Error: ${error.message}. Intenta nuevamente. 🔄`
        });
    } finally {
        state.aiLoading = false;
        if (input) input.value = '';
        state.aiImage = null;
        state.aiImagePreview = null;
        render();
        setTimeout(() => {
            const msgs = document.querySelector('.ai-chat-messages');
            if (msgs) msgs.scrollTop = msgs.scrollHeight;
        }, 100);
    }
}

// ==================== ADMINS AUTORIZADOS PARA IA ====================
const AI_ADMIN_EMAILS = [
    'compualextech24@gmail.com',
    'flavioalejandrov24@gmail.com'
];

function isAIAdmin() {
    if (!state.user?.email) return false;
    return AI_ADMIN_EMAILS.includes(state.user.email.toLowerCase().trim());
}

function showAIAccessDeniedModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-window ai-access-modal">
            <div class="modal-header modal-header-info">
                <i class="fas fa-robot" style="color:#3b82f6;font-size:28px"></i>
                <div class="header-text">
                    <h3>Función de Autofill con IA</h3>
                </div>
            </div>
            <div class="modal-body">
                <div class="ai-access-body">
                    <div class="ai-access-icon-wrap">
                        <i class="fas fa-lock-open"></i>
                    </div>
                    <h4 class="ai-access-title">¿Qué es el Autofill IA?</h4>
                    <p class="ai-access-desc">
                        Esta función te permite subir una <strong>imagen</strong> o escribir el
                        <strong>texto de una oferta de empleo</strong>, y la inteligencia artificial
                        extrae automáticamente todos los datos para llenar el formulario sin que
                        tengas que capturar campo por campo.
                    </p>
                    <div class="ai-access-divider"></div>
                    <div class="ai-access-notice">
                        <i class="fas fa-shield-alt"></i>
                        <p>
                            Actualmente esta función está disponible <strong>solo para administradores</strong>
                            del portal. Si deseas acceso o quieres una aplicación similar para tu negocio,
                            contáctanos:
                        </p>
                    </div>
                    <div class="ai-access-contact">
                        <i class="fas fa-envelope"></i>
                        <span class="ai-contact-email">Correo de contacto próximamente</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary modal-ok" style="width:100%">
                    <i class="fas fa-check mr-1"></i> Entendido
                </button>
            </div>
        </div>
    `;
    document.getElementById('modal-root').appendChild(modal);
    modal.querySelector('.modal-ok').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

function toggleAIChat() {
    // Check admin access first
    if (!isAIAdmin()) {
        showAIAccessDeniedModal();
        return;
    }
    state.aiChatOpen = !state.aiChatOpen;
    if (state.aiChatOpen && state.aiMessages.length === 0) {
        state.aiMessages = [{
            role: 'bot',
            content: '¡Hola! Envíame una imagen o describe la vacante y te ayudo a llenar el formulario. 📋✨'
        }];
    }
    render();
}

function startAutofill() {
    if (!state.aiExtractedData) {
        showModal('info', 'Sin datos', 'Primero envía información para procesar');
        return;
    }
    const data = state.aiExtractedData;
    if (data.company)           state.formData.company           = data.company;
    if (data.job_title)         state.formData.job_title         = data.job_title;
    if (data.description)       state.formData.description       = data.description;
    if (data.requirements)      state.formData.requirements      = data.requirements;
    if (data.location)          state.formData.location          = data.location;
    if (data.contact_phone)     state.formData.contact_phone     = data.contact_phone;
    if (data.publication_date)  state.formData.publication_date  = data.publication_date;
    if (data.schedule)          state.formData.schedule          = data.schedule;
    if (data.work_days)         state.formData.work_days         = data.work_days;
    if (data.category)          state.formData.category          = data.category;
    state.aiChatOpen = false;
    state.aiMessages = [];
    state.aiExtractedData = null;
    render();
    showModal('success', '¡Formulario rellenado!', 'Revisa y ajusta antes de guardar ✨');
}

function handleAIImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
        showModal('error', 'Archivo Grande', 'Máximo 10MB');
        event.target.value = '';
        return;
    }
    state.aiImage = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        state.aiImagePreview = e.target.result;
        render();
    };
    reader.readAsDataURL(file);
}

function removeAIImage() {
    state.aiImage = null;
    state.aiImagePreview = null;
    render();
}

function clearAIData() {
    state.aiChatOpen = false;
    state.aiMessages = [];
    state.aiLoading = false;
    state.aiImage = null;
    state.aiImagePreview = null;
    state.aiExtractedData = null;
    state.chatMinimized = false;
}

// ==================== FORMULARIO ====================
function cleanForm() {
    showModal('question', 'Limpiar formulario', '¿Limpiar todos los campos?', () => {
        resetJobForm();
        clearAIData();
        render();
    });
}

function cancelForm() {
    showModal('question-danger', 'Cancelar', '¿Cancelar? Los cambios se perderán', () => {
        state.editingVacancy = null;
        state.view = 'dashboard';
        resetJobForm();
        clearAIData();
        render();
    });
}

function resetAuthForm() {
    state.formData.email = '';
    state.formData.password = '';
    state.formData.confirmPassword = '';
}

function resetJobForm() {
    state.formData.company = '';
    state.formData.job_title = '';
    state.formData.description = '';
    state.formData.requirements = '';
    state.formData.location = '';
    state.formData.contact_phone = '';
    state.formData.publication_date = '';
    state.formData.schedule = '';
    state.formData.work_days = '';
    state.formData.category = '';
    state.formData.imageBase64 = '';
}