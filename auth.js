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
        showModal('error', 'Error de inicio de sesión', error.message || 'Verifica tus credenciales');
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
        showModal('success', '¡Registro exitoso!', 'Revisa tu correo para confirmar tu cuenta');
        state.view = 'login';
        resetAuthForm();
        render();
    } catch (error) {
        console.error('❌ Error signup:', error);
        showModal('error', 'Error', error.message);
    } finally {
        hideLoading();
    }
}

async function handleLogout() {
    if (state.isLoggingOut) {
        console.log('⏸️ Ya hay un logout en proceso');
        return;
    }
    showModal('question', 'Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', async () => {
        console.log('🚪 Cerrando sesión...');
        state.isLoggingOut = true;
        showLoading();
        try {
            await supabaseClient.auth.signOut();
            resetCompleteState();
            console.log('✅ Sesión cerrada exitosamente');
            render();
        } catch (error) {
            console.error('❌ Error logout:', error);
            showModal('error', 'Error', 'Hubo un problema al cerrar sesión');
            state.isLoggingOut = false;
        } finally {
            hideLoading();
        }
    });
}

async function handleDeleteAccount() {
    showModal('question', 'Eliminar cuenta', '¿ELIMINAR tu cuenta y TODAS tus vacantes? Esta acción no se puede deshacer.', async () => {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-window">
                <div class="modal-header">
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
        state.view = 'dashboard';
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
    state.view = 'dashboard';
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
        showModal('error', 'Imagen requerida', 'Debes subir una imagen');
        return;
    }
    if (!state.user?.id) {
        showModal('error', 'Sesión requerida', 'Inicia sesión para publicar');
        return;
    }
    showLoading();
    try {
        const vacancyData = {
            user_id: state.user.id,
            company: state.formData.company?.trim() || 'SIN INFORMACIÓN',
            job_title: state.formData.job_title?.trim() || 'SIN INFORMACIÓN',
            description: state.formData.description?.trim() || 'SIN INFORMACIÓN',
            location: state.formData.location?.trim() || null,
            contact_phone: state.formData.contact_phone?.trim() || null,
            publication_date: state.formData.publication_date?.trim() || null,
            schedule: state.formData.schedule?.trim() || null,
            work_days: state.formData.work_days?.trim() || null,
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
        location: vacancy.location || '',
        contact_phone: vacancy.contact_phone || '',
        publication_date: vacancy.publication_date || '',
        schedule: vacancy.schedule || '',
        work_days: vacancy.work_days || '',
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

function toggleAIChat() {
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
    if (data.company) state.formData.company = data.company;
    if (data.job_title) state.formData.job_title = data.job_title;
    if (data.description) state.formData.description = data.description;
    if (data.location) state.formData.location = data.location;
    if (data.contact_phone) state.formData.contact_phone = data.contact_phone;
    if (data.publication_date) state.formData.publication_date = data.publication_date;
    if (data.schedule) state.formData.schedule = data.schedule;
    if (data.work_days) state.formData.work_days = data.work_days;
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
    showModal('question', 'Cancelar', '¿Cancelar? Los cambios se perderán', () => {
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
    state.formData.location = '';
    state.formData.contact_phone = '';
    state.formData.publication_date = '';
    state.formData.schedule = '';
    state.formData.work_days = '';
    state.formData.imageBase64 = '';
}