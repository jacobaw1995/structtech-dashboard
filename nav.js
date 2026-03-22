var NAV_PAGES = [
  { id: 'dashboard',   label: 'Dashboard',   href: 'index.html',       icon: '⊞', soon: false },
  { id: 'clients',     label: 'Clients',     href: 'clients.html',     icon: '◉', soon: true  },
  { id: 'automations', label: 'Automations', href: 'automations.html', icon: '⚡', soon: true  },
  { id: 'invoices',    label: 'Invoices',    href: 'invoices.html',    icon: '≋', soon: true  },
  { id: 'reports',     label: 'Reports',     href: 'reports.html',     icon: '≡', soon: true  },
  { id: 'content',     label: 'Content',     href: 'content.html',     icon: '✦', soon: true  }
];

// ── Toast ────────────────────────────────────────────────────────────────
var _toastEl = null;
var _toastTimer = null;

function showToast(msg) {
  if (!_toastEl) {
    _toastEl = document.createElement('div');
    _toastEl.className = 'st-toast';
    document.body.appendChild(_toastEl);
  }
  _toastEl.textContent = msg;
  _toastEl.classList.add('show');
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function () {
    _toastEl.classList.remove('show');
  }, 2200);
}

// ── Nav render ───────────────────────────────────────────────────────────
function renderNav(activePage) {
  // 1. Top nav (desktop) → #app-nav
  var topEl = document.getElementById('app-nav');
  if (topEl) {
    var html = '';
    NAV_PAGES.forEach(function (p, i) {
      var cls = 'nav-link' + (p.id === activePage ? ' active' : '') + (p.soon ? ' soon' : '');
      if (i > 0) html += '<div class="nav-divider"></div>';
      if (p.soon) {
        html += '<a class="' + cls + '" data-soon="' + p.label + '" href="#">' + p.label + '</a>';
      } else {
        html += '<a class="' + cls + '" href="' + p.href + '">' + p.label + '</a>';
      }
    });
    topEl.innerHTML = html;

    // Intercept soon-link clicks in top nav
    topEl.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-soon]');
      if (a) {
        e.preventDefault();
        showToast('🚧 ' + a.dataset.soon + ' — coming soon');
      }
    });
  }

  // 2. Bottom nav (mobile) — injected into <body>
  var existing = document.getElementById('bottom-nav');
  if (existing) existing.remove();

  var bnav = document.createElement('nav');
  bnav.id = 'bottom-nav';
  bnav.className = 'bottom-nav';

  NAV_PAGES.forEach(function (p) {
    var cls = 'bnav-item' + (p.id === activePage ? ' active' : '') + (p.soon ? ' soon' : '');
    var item = document.createElement('a');
    item.className = cls;
    item.href = p.soon ? '#' : p.href;
    item.innerHTML = '<span class="bnav-icon">' + p.icon + '</span><span class="bnav-label">' + p.label + '</span>';
    if (p.soon) {
      item.dataset.soon = p.label;
      item.addEventListener('click', function (e) {
        e.preventDefault();
        showToast('🚧 ' + p.label + ' — coming soon');
      });
    }
    bnav.appendChild(item);
  });

  document.body.appendChild(bnav);
}
