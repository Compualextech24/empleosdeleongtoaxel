// ==================== CONTADOR DE VISITAS — Empleos León GTO ====================
// Lógica:
//   1. Guarda el total en Supabase (tabla: visit_counter, fila única id=1)
//   2. Usa localStorage para no contar la misma visita más de una vez por sesión/día
//   3. Base de arranque: 2000 visitas
//   4. Muestra un widget fijo en la parte inferior de la pantalla
// ================================================================================

const COUNTER_BASE   = 2000;          // Visitas de inicio
const COUNTER_ROW_ID = 1;            // ID único de la fila en Supabase
const COUNTER_TABLE  = 'visit_counter'; // Nombre de la tabla en Supabase
const SESSION_KEY    = 'emp_leon_visited'; // Clave en localStorage

// ---- Inyectar el widget en el DOM ----
function injectCounterBar() {
    if (document.getElementById('visit-counter-bar')) return; // ya existe
    const bar = document.createElement('div');
    bar.id    = 'visit-counter-bar';
    bar.className = 'visit-counter-bar';
    bar.innerHTML = `
        <span class="visit-counter-icon">👥</span>
        <span class="visit-counter-text">Tu comunidad ha alcanzado</span>
        <span class="visit-counter-dot"></span>
        <span class="visit-counter-number" id="visit-count-display">...</span>
        <span class="visit-counter-text">usuarios</span>
    `;
    document.body.appendChild(bar);

    // Añadir padding-bottom al body para que el contenido no quede tapado
    document.body.style.paddingBottom = '46px';
}

// ---- Leer el contador desde Supabase ----
async function fetchCounterFromDB() {
    try {
        const { data, error } = await supabaseClient
            .from(COUNTER_TABLE)
            .select('count')
            .eq('id', COUNTER_ROW_ID)
            .single();

        if (error || !data) return COUNTER_BASE;
        return data.count || COUNTER_BASE;
    } catch (e) {
        console.warn('⚠️ Counter fetch error:', e);
        return COUNTER_BASE;
    }
}

// ---- Incrementar el contador en Supabase ----
async function incrementCounterInDB(currentCount) {
    try {
        const newCount = currentCount + 1;
        await supabaseClient
            .from(COUNTER_TABLE)
            .upsert({ id: COUNTER_ROW_ID, count: newCount }, { onConflict: 'id' });
        return newCount;
    } catch (e) {
        console.warn('⚠️ Counter increment error:', e);
        return currentCount;
    }
}

// ---- Comprobar si ya se contó esta visita hoy ----
function alreadyCountedToday() {
    try {
        const stored = localStorage.getItem(SESSION_KEY);
        if (!stored) return false;
        const { date } = JSON.parse(stored);
        const today = new Date().toLocaleDateString('es-MX');
        return date === today;
    } catch {
        return false;
    }
}

// ---- Marcar visita de hoy ----
function markVisitedToday() {
    try {
        const today = new Date().toLocaleDateString('es-MX');
        localStorage.setItem(SESSION_KEY, JSON.stringify({ date: today }));
    } catch {
        // localStorage no disponible — ignorar
    }
}

// ---- Actualizar el número en pantalla ----
function updateCountDisplay(count) {
    const el = document.getElementById('visit-count-display');
    if (el) el.textContent = count.toLocaleString('es-MX');
}

// ---- Animación de conteo (efecto tick-up) ----
function animateCount(from, to, duration = 1200) {
    const el = document.getElementById('visit-count-display');
    if (!el) return;
    const start = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        const current  = Math.round(from + (to - from) * eased);
        el.textContent = current.toLocaleString('es-MX');
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// ---- Inicialización principal ----
async function initVisitCounter() {
    // 1. Inyectar el widget
    injectCounterBar();

    // 2. Leer total actual
    const currentCount = await fetchCounterFromDB();

    // 3. Si no se ha contado hoy → incrementar
    let displayCount = currentCount;
    if (!alreadyCountedToday()) {
        displayCount = await incrementCounterInDB(currentCount);
        markVisitedToday();
    }

    // 4. Animar desde un poco antes hasta el valor real
    const animFrom = Math.max(COUNTER_BASE, displayCount - 30);
    animateCount(animFrom, displayCount);
}

// ---- Arrancar cuando el DOM esté listo ----
// Esperamos a que supabaseClient esté disponible (se inicializa en config.js)
function waitForSupabaseAndStart() {
    if (typeof supabaseClient !== 'undefined') {
        initVisitCounter();
    } else {
        setTimeout(waitForSupabaseAndStart, 150);
    }
}

window.addEventListener('DOMContentLoaded', waitForSupabaseAndStart);

console.log('✅ counter.js cargado');