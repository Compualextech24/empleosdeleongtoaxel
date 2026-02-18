// ==================== CONTADOR DE VISITAS — Empleos León GTO ====================
// Estrategia robusta:
//   • Usa UPDATE directo (más compatible con RLS que upsert)
//   • Si falla Supabase, muestra valor desde localStorage como fallback
//   • No cuenta la misma visita más de 1 vez por día por dispositivo
//   • Base: 2000 visitas
// ================================================================================

const COUNTER_TABLE  = 'visit_counter';
const COUNTER_ROW_ID = 1;
const COUNTER_BASE   = 2000;
const SESSION_KEY    = 'emp_leon_visited';

// ---- Inyectar el widget fijo al fondo ----
function injectCounterBar() {
    if (document.getElementById('visit-counter-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'visit-counter-bar';
    bar.className = 'visit-counter-bar';
    bar.innerHTML = `
        <span class="visit-counter-icon">👥</span>
        <span class="visit-counter-text">Tu comunidad ha alcanzado</span>
        <span class="visit-counter-dot"></span>
        <span class="visit-counter-number" id="visit-count-display">...</span>
        <span class="visit-counter-text">usuarios</span>
    `;
    document.body.appendChild(bar);
    document.body.style.paddingBottom = '46px';
}

// ---- ¿Ya se contó hoy? ----
function alreadyCountedToday() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return false;
        const { date } = JSON.parse(raw);
        return date === new Date().toISOString().slice(0, 10);
    } catch { return false; }
}

function markVisitedToday() {
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            date: new Date().toISOString().slice(0, 10)
        }));
    } catch {}
}

// ---- Leer contador ----
async function getCount() {
    try {
        const { data, error } = await supabaseClient
            .from(COUNTER_TABLE)
            .select('count')
            .eq('id', COUNTER_ROW_ID)
            .single();
        if (error) throw error;
        return Number(data.count) || COUNTER_BASE;
    } catch (e) {
        console.warn('Counter read error:', e.message);
        try {
            const cached = localStorage.getItem('emp_leon_count');
            if (cached) return Number(cached);
        } catch {}
        return COUNTER_BASE;
    }
}

// ---- Incrementar con UPDATE directo ----
async function incrementCount(current) {
    const next = current + 1;
    try {
        const { error } = await supabaseClient
            .from(COUNTER_TABLE)
            .update({ count: next })
            .eq('id', COUNTER_ROW_ID);
        if (error) throw error;
        return next;
    } catch (e) {
        console.warn('Counter update error:', e.message);
        try { localStorage.setItem('emp_leon_count', String(next)); } catch {}
        return next;
    }
}

// ---- Animación tick-up ----
function animateCount(from, to, ms) {
    ms = ms || 1400;
    const el = document.getElementById('visit-count-display');
    if (!el) return;
    const t0 = performance.now();
    function frame(now) {
        const p = Math.min((now - t0) / ms, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (to - from) * ease).toLocaleString('es-MX');
        if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

// ---- Punto de entrada ----
async function initVisitCounter() {
    injectCounterBar();
    const current = await getCount();
    try { localStorage.setItem('emp_leon_count', String(current)); } catch {}
    let display = current;
    if (!alreadyCountedToday()) {
        display = await incrementCount(current);
        markVisitedToday();
    }
    animateCount(Math.max(COUNTER_BASE, display - 25), display);
}

function waitAndStart() {
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        initVisitCounter().catch(function(e) { console.warn('Counter init error:', e); });
    } else {
        setTimeout(waitAndStart, 200);
    }
}

window.addEventListener('DOMContentLoaded', waitAndStart);
console.log('✅ counter.js cargado');