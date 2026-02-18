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
        showModal('error', 'Credenciales incorrectas', 'Correo o contraseña incorrectos');
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
        
        if (error) {
            if (error.message && (error.message.includes('already registered') || error.status === 422)) {
                hideLoading();
                showModal('error', 'Correo ya registrado', `El correo ${state.formData.email.trim()} ya tiene una cuenta`);
                return;
            }
            throw error;
        }
        
        if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
            hideLoading();
            showModal('error', 'Correo ya registrado', `El correo ${state.formData.email.trim()} ya tiene una cuenta`);
            return;
        }
        
        hideLoading();
        showModal('info', '📧 Revisa tu correo', `Se envió un enlace de confirmación a: ${state.formData.email.trim()}`);
        state.view = 'login';
        resetAuthForm();
        render();
    } catch (error) {
        console.error('❌ Error signup:', error);
        showModal('error', 'Error de registro', error.message || 'No se pudo crear la cuenta');
        hideLoading();
    }
}

async function handleLogout() {
    showModal('question', 'Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', async () => {
        console.log('🚪 Cerrando sesión...');
        showLoading();
        
        try {
            await supabaseClient.auth.signOut();
            console.log('✅ Sesión cerrada');
        } catch (error) {
            console.error('❌ Error logout:', error);
        }
        
        resetCompleteState();
        hideLoading();
        render();
    });
}

async function handleGuestAccess() {
    showModal('question', 'Acceso como invitado', '¿Continuar como invitado? No podrás crear vacantes', async () => {
        console.log('👤 Modo invitado activado');
        state.isGuest = true;
        state.user = null;
        state.view = 'dashboard';
        await loadVacancies();
        render();
    });
}

async function handleDeleteAccount() {
    showModal('question', 'Eliminar cuenta', '¿ELIMINAR tu cuenta y TODAS tus vacantes? No se puede deshacer', async () => {
        if (!state.user?.id) return;
        
        showLoading();
        try {
            // Eliminar todas las vacantes del usuario
            const { error: vacError } = await supabaseClient
                .from(ENDPOINTS.TABLES.VACANCIES)
                .delete()
                .eq('user_id', state.user.id);
            
            if (vacError) throw vacError;
            
            // Eliminar cuenta
            const { error: delError } = await supabaseClient.auth.admin.deleteUser(state.user.id);
            if (delError) throw delError;
            
            await supabaseClient.auth.signOut();
            resetCompleteState();
            hideLoading();
            render();
            showModal('success', 'Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente');
        } catch (error) {
            console.error('❌ Error deleting account:', error);
            hideLoading();
            showModal('error', 'Error', 'No se pudo eliminar la cuenta. Contacta al soporte.');
        }
    });
}

// ==================== VACANTES ====================
async function loadVacancies() {
    try {
        const { data, error } = await supabaseClient
            .from(ENDPOINTS.TABLES.VACANCIES)
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        state.vacancies = data || [];
        state.filteredVacancies = [...state.vacancies];
        console.log(`✅ ${state.vacancies.length} vacantes cargadas`);
    } catch (error) {
        console.error('❌ Error loading vacancies:', error);
        state.vacancies = [];
        state.filteredVacancies = [];
    }
}

async function handleSaveVacancy(e) {
    e.preventDefault();
    if (state.loading) return;
    
    if (!state.user?.id) {
        showModal('error', 'Sesión requerida', 'Inicia sesión para publicar');
        return;
    }
    
    // Imagen por defecto
    if (!state.formData.imageBase64) {
        state.formData.imageBase64 = 'https://raw.githubusercontent.com/Compualextech24/empleosdeleongtoaxel/main/SINFOTO.jpg';
    }
    
    // Validar campos
    const missingFields = [];
    if (!state.formData.company?.trim()) missingFields.push('• Empresa');
    if (!state.formData.description?.trim()) missingFields.push('• Descripción');
    if (!state.formData.publication_date?.trim()) missingFields.push('• Fecha');
    if (!state.formData.category?.trim()) missingFields.push('• Categoría');
    
    if (missingFields.length > 0) {
        showModal('warning', 'Campos requeridos', `Completa:\n${missingFields.join('\n')}`);
        return;
    }
    
    // Validar fecha DD/MM/AAAA
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(state.formData.publication_date.trim())) {
        showModal('warning', 'Formato de fecha incorrecto', 'Usa DD/MM/AAAA (ej: 25/12/2025)');
        return;
    }
    
    showLoading();
    
    try {
        const vacancyData = {
            user_id: state.user.id,
            company: state.formData.company?.trim().toUpperCase() || 'SIN INFORMACIÓN',
            job_title: state.formData.job_title?.trim() || 'SIN INFORMACIÓN',
            description: state.formData.description?.trim() || 'SIN INFORMACIÓN',
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
        
        await loadVacancies();
        
        hideLoading();
        state.view = 'dashboard';
        render();
        showModal('success', '¡Éxito!', wasEditing ? 'Vacante actualizada ✅' : 'Vacante publicada ✅');
        
    } catch (error) {
        console.error('❌ Error saving:', error);
        hideLoading();
        showModal('error', 'Error al guardar', error.message || 'Intenta de nuevo');
    }
}

async function handleDeleteVacancy(vacancyId) {
    const vacancy = state.vacancies.find(v => v.id === vacancyId);
    if (!vacancy) return;
    
    showModal('question', 'Eliminar vacante', `¿Eliminar vacante de ${vacancy.company}?`, async () => {
        showLoading();
        try {
            const { error } = await supabaseClient
                .from(ENDPOINTS.TABLES.VACANCIES)
                .delete()
                .eq('id', vacancy.id);
            
            if (error) throw error;
            
            await loadVacancies();
            render();
            hideLoading();
            showModal('success', 'Eliminada', 'Vacante eliminada correctamente');
        } catch (error) {
            console.error('❌ Error deleting:', error);
            hideLoading();
            showModal('error', 'Error', 'No se pudo eliminar');
        }
    });
}

function handleEditVacancy(vacancyId) {
    const vacancy = state.vacancies.find(v => v.id === vacancyId);
    if (!vacancy) return;
    
    state.editingVacancy = vacancy;
    state.formData.company = vacancy.company || '';
    state.formData.job_title = vacancy.job_title || '';
    state.formData.description = vacancy.description || '';
    state.formData.location = vacancy.location || 'León, gto';
    state.formData.contact_phone = vacancy.contact_phone || '';
    state.formData.publication_date = vacancy.publication_date || '';
    state.formData.schedule = vacancy.schedule || '';
    state.formData.work_days = vacancy.work_days || '';
    state.formData.category = vacancy.category || '';
    state.formData.imageBase64 = vacancy.image_base64 || '';
    state.view = 'form';
    render();
}

function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        showModal('error', 'Archivo muy grande', 'Máximo 5MB');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        state.formData.imageBase64 = e.target.result;
        render();
    };
    reader.readAsDataURL(file);
}

console.log('✅ Auth.js cargado');
