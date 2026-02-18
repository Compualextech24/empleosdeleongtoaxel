// ==================== CONTADOR DE VISITAS ====================
const COUNTER_ROW_ID = 1;
const COUNTER_BASE = 2000;
const SESSION_KEY = 'emp_leon_visited';

function injectCounterBar() {
    if (document.getElementById('visit-counter-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'visit-counter-bar';
    bar.className = 'visit-counter-bar';
    bar.innerHTML = `
        <span class="visit-counter-icon">👥</span>
        <span class="visit-counter-text">Usuarios:</span>
        <span class="visit-counter-number" id="visit-count-display">...</span>
    `;
    document.body.appendChild(bar);
    document.body.style.paddingBottom = '50px';
}

function alreadyCountedToday() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return false;
        const { date } = JSON.parse(raw);
        return date === new Date().toISOString().slice(0, 10);
    } catch { 
        return false; 
    }
}

function markVisitedToday() {
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            date: new Date().toISOString().slice(0, 10)
        }));
    } catch {}
}

async function getCount() {
    try {
        const { data, error } = await supabaseClient
            .from(ENDPOINTS.TABLES.COUNTER)
            .select('count')
            .eq('id', COUNTER_ROW_ID)
            .single();
        
        if (error) throw error;
        return Number(data.count) || COUNTER_BASE;
    } catch (e) {
        console.warn('Counter read error:', e.message);
        const cached = localStorage.getItem('emp_leon_count');
        return cached ? Number(cached) : COUNTER_BASE;
    }
}

async function incrementCount(current) {
    const next = current + 1;
    try {
        const { error } = await supabaseClient
            .from(ENDPOINTS.TABLES.COUNTER)
            .update({ count: next })
            .eq('id', COUNTER_ROW_ID);
        
        if (error) throw error;
        return next;
    } catch (e) {
        console.warn('Counter update error:', e.message);
        localStorage.setItem('emp_leon_count', String(next));
        return next;
    }
}

function animateCount(from, to) {
    const el = document.getElementById('visit-count-display');
    if (!el) return;
    
    const duration = 1400;
    const t0 = performance.now();
    
    function frame(now) {
        const p = Math.min((now - t0) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (to - from) * ease).toLocaleString('es-MX');
        if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

async function initVisitCounter() {
    injectCounterBar();
    const current = await getCount();
    localStorage.setItem('emp_leon_count', String(current));
    
    let display = current;
    if (!alreadyCountedToday()) {
        display = await incrementCount(current);
        markVisitedToday();
    }
    
    animateCount(Math.max(COUNTER_BASE, display - 25), display);
}

function waitAndStart() {
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        initVisitCounter().catch(e => console.warn('Counter init error:', e));
    } else {
        setTimeout(waitAndStart, 200);
    }
}

window.addEventListener('DOMContentLoaded', waitAndStart);
console.log('✅ Counter.js cargado');
