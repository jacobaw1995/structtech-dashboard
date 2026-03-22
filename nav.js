var NAV_PAGES = [
  { id: 'dashboard',   label: 'Dashboard',   href: 'index.html',       icon: '⊞', soon: false },
  { id: 'clients',     label: 'Clients',     href: 'clients.html',     icon: '◉', soon: true  },
  { id: 'automations', label: 'Automations', href: 'automations.html', icon: '⚡', soon: true  },
  { id: 'invoices',    label: 'Invoices',    href: 'invoices.html',    icon: '≋', soon: true  },
  { id: 'reports',     label: 'Reports',     href: 'reports.html',     icon: '≡', soon: true  },
  { id: 'content',     label: 'Content',     href: 'content.html',     icon: '✦', soon: true  }
];

function renderNav(activePage) {
  // 1. Render top nav into #app-nav
  var topEl = document.getElementById('app-nav');
  if (topEl) {
    var html = '';
    NAV_PAGES.forEach(function(p, i) {
      var cls = 'nav-link';
      if (p.id === activePage) cls += ' active';
      if (p.soon) cls += ' soon';
      if (i > 0) html += '<div class="nav-divider"></div>';
      html += '<a href="' + p.href + '" class="' + cls + '">' + p.label + (p.soon ? ' ·' : '') + '</a>';
    });
    topEl.innerHTML = html;
  }

  // 2. Render + inject bottom nav
  var existing = document.getElementById('bottom-nav');
  if (existing) existing.remove();
  var bnav = document.createElement('nav');
  bnav.id = 'bottom-nav';
  bnav.className = 'bottom-nav';
  var bhtml = '';
  NAV_PAGES.forEach(function(p) {
    var cls = 'bnav-item';
    if (p.id === activePage) cls += ' active';
    if (p.soon) cls += ' soon';
    bhtml += '<a href="' + p.href + '" class="' + cls + '">' +
      '<span class="bnav-icon">' + p.icon + '</span>' +
      '<span class="bnav-label">' + p.label + '</span></a>';
  });
  bnav.innerHTML = bhtml;
  document.body.appendChild(bnav);
}
