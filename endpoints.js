// ==================== CONFIGURACIÓN CENTRALIZADA ====================
const ENDPOINTS = {
    SUPABASE_URL: 'https://mecrloufrzbfcihioeve.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lY3Jsb3VmcnpiZmNpaGlvZXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NTM2OTgsImV4cCI6MjA4NjMyOTY5OH0.Gs36EkNHv5vG2CPdrK7XtCnWvX5NYkyPY9moTdezbVA',
    SUPABASE_REDIRECT_URL: 'https://compualextech24.github.io/empleosdeleongtoaxel/',
    TABLES: {
        VACANCIES: 'vacancies',
        COUNTER: 'visit_counter'
    }
};

window.ENDPOINTS = ENDPOINTS;
console.log('✅ Endpoints cargados');
