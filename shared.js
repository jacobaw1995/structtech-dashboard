// ── Supabase ────────────────────────────────────────────────────────────────
var SUPABASE_URL = 'https://ejlhrykcdfcyeooooodx.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbGhyeWtjZGZjeWVvb29vb2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NjQ1NjUsImV4cCI6MjA4OTQ0MDU2NX0._bqBaeJtYNaykrzc5rTzuYzgsRYeX3ikzFVrpbv_kr4';
var SB_HEADERS = { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY };

// ── Global state (single source of truth) ──────────────────────────────────
var state = {
  task_state: {},
  income_entries: [],
  current_week: 1,
  os_data: { clients: [], sops: [], notes: [], prospects: [] }
};

// ── ID generator ────────────────────────────────────────────────────────────
var idCounter = Date.now();
function genId() { return ++idCounter; }

// ── Sync status ─────────────────────────────────────────────────────────────
function setSyncStatus(s) {
  var el = document.getElementById('sync-status');
  if (!el) return;
  var labels = { loading: '● Loading', saving: '● Saving', saved: '● Saved', failed: '● Save failed' };
  var classes = { loading: 'sync-loading', saving: 'sync-saving', saved: 'sync-saved', failed: 'sync-failed' };
  el.textContent = labels[s] || s;
  el.className = 'sync-status ' + (classes[s] || '');
}

// ── Apply loaded data into state ────────────────────────────────────────────
function applyState(data) {
  if (data.task_state)     state.task_state     = data.task_state     || {};
  if (data.income_entries) state.income_entries = data.income_entries || [];
  if (data.current_week)   state.current_week   = data.current_week   || 1;
  if (data.os_data)        state.os_data        = data.os_data;
  if (!state.os_data)           state.os_data          = {};
  if (!state.os_data.clients)   state.os_data.clients  = [];
  if (!state.os_data.sops)      state.os_data.sops     = [];
  if (!state.os_data.notes)     state.os_data.notes    = [];
  if (!state.os_data.prospects) state.os_data.prospects = [];
}

// ── Supabase load ────────────────────────────────────────────────────────────
async function loadState() {
  setSyncStatus('loading');
  try {
    var r = await fetch(
      SUPABASE_URL + '/rest/v1/structtech_state?id=eq.jacob&select=task_state,income_entries,current_week,os_data',
      { headers: SB_HEADERS }
    );
    if (!r.ok) throw new Error('HTTP ' + r.status);
    var rows = await r.json();
    if (rows && rows.length > 0) applyState(rows[0]);
  } catch(e) {
    setSyncStatus('failed');
    return;
  }
  setSyncStatus('saved');
}

// ── Supabase save (PATCH) ────────────────────────────────────────────────────
async function saveState() {
  setSyncStatus('saving');
  var body = JSON.stringify({
    id: 'jacob',
    task_state: state.task_state,
    income_entries: state.income_entries,
    current_week: state.current_week,
    os_data: state.os_data,
    updated_at: new Date().toISOString()
  });
  try {
    var r = await fetch(SUPABASE_URL + '/rest/v1/structtech_state?id=eq.jacob', {
      method: 'PATCH',
      headers: Object.assign({}, SB_HEADERS, { 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }),
      body: body
    });
    if (r.ok) { setSyncStatus('saved'); }
    else { throw new Error('HTTP ' + r.status); }
  } catch(e) { setSyncStatus('failed'); }
}

// ── Debounced save ──────────────────────────────────────────────────────────
var saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 600);
}

// ── HTML escape helpers ─────────────────────────────────────────────────────
function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function escAttr(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ── Income calculator (reusable across pages) ───────────────────────────────
function calcIncome() {
  var total = 0, mrr = 0;
  state.income_entries.forEach(function(e) {
    var amt = parseFloat(e.amount) || 0;
    total += amt;
    if (e.type === 'Retainer') mrr += amt;
  });
  return { total: total, mrr: mrr };
}
