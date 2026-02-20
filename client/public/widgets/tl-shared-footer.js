(function() {
  'use strict';

  var DW_SHARED_FOOTER = {
    baseUrl: '',
    config: {
      theme: 'dark',
      showEcosystem: true,
      showSocial: true,
      showNewsletter: false,
      maxApps: 8,
      year: new Date().getFullYear()
    },

    init: function(options) {
      options = options || {};
      this.baseUrl = options.baseUrl || this.detectBaseUrl();
      Object.assign(this.config, options.config || {});

      this.injectStyles();
      this.fetchAndRender();
    },

    detectBaseUrl: function() {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.indexOf('tl-shared-footer') !== -1) {
          return scripts[i].src.replace(/\/(?:api\/ecosystem\/shared\/footer\.js|widgets\/tl-shared-footer\.js).*$/, '');
        }
      }
      return 'https://dwsc.io';
    },

    fetchAndRender: function() {
      var self = this;
      fetch(this.baseUrl + '/api/ecosystem/widget-data')
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data.success) {
            self.renderFooter(data);
          } else {
            self.renderFooter(null);
          }
        })
        .catch(function() {
          self.renderFooter(null);
        });
    },

    renderFooter: function(data) {
      var cfg = this.config;
      var el = document.createElement('footer');
      el.className = 'dw-footer dw-footer-' + cfg.theme;
      el.setAttribute('data-testid', 'dw-shared-footer');

      var stats = data ? data.stats : { totalApps: 29, verifiedApps: 29, totalWidgets: 71, totalLOC: '1.8M+' };
      var apps = data ? data.apps : [];
      var topApps = apps.slice(0, cfg.maxApps);

      var html = '<div class="dw-footer-inner">';

      html += '<div class="dw-footer-grid">';

      html += '<div class="dw-footer-col">' +
        '<div class="dw-footer-brand">' +
          '<svg class="dw-footer-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>' +
          '<span class="dw-footer-brand-name">DarkWave Studios</span>' +
        '</div>' +
        '<p class="dw-footer-tagline">Dark design, bright future. Full-service web development agency building interconnected digital ecosystems.</p>' +
        '<div class="dw-footer-stats-row">' +
          '<span class="dw-footer-stat-pill"><strong>' + stats.totalApps + '</strong> Apps</span>' +
          '<span class="dw-footer-stat-pill"><strong>' + stats.totalWidgets + '</strong> Widgets</span>' +
          '<span class="dw-footer-stat-pill"><strong>' + stats.totalLOC + '</strong> LOC</span>' +
        '</div>' +
      '</div>';

      html += '<div class="dw-footer-col">' +
        '<h4 class="dw-footer-heading">Platform</h4>' +
        '<ul class="dw-footer-links">' +
          '<li><a href="' + this.baseUrl + '/explore">Explore Hub</a></li>' +
          '<li><a href="' + this.baseUrl + '/hub">Trust Layer Hub</a></li>' +
          '<li><a href="' + this.baseUrl + '/ecosystem">Ecosystem</a></li>' +
          '<li><a href="' + this.baseUrl + '/developers">Developers</a></li>' +
          '<li><a href="' + this.baseUrl + '/guardian">Guardian AI</a></li>' +
          '<li><a href="' + this.baseUrl + '/quote">Get a Quote</a></li>' +
        '</ul>' +
      '</div>';

      html += '<div class="dw-footer-col">' +
        '<h4 class="dw-footer-heading">Resources</h4>' +
        '<ul class="dw-footer-links">' +
          '<li><a href="' + this.baseUrl + '/blog">Blog</a></li>' +
          '<li><a href="' + this.baseUrl + '/tools">Free Tools</a></li>' +
          '<li><a href="' + this.baseUrl + '/booking">Book a Call</a></li>' +
          '<li><a href="' + this.baseUrl + '/contact">Contact</a></li>' +
          '<li><a href="' + this.baseUrl + '/mission">Mission</a></li>' +
          '<li><a href="' + this.baseUrl + '/privacy">Privacy Policy</a></li>' +
        '</ul>' +
      '</div>';

      if (cfg.showEcosystem && topApps.length > 0) {
        html += '<div class="dw-footer-col">' +
          '<h4 class="dw-footer-heading">Ecosystem</h4>' +
          '<ul class="dw-footer-links dw-footer-apps">';
        for (var i = 0; i < topApps.length; i++) {
          html += '<li><a href="' + this.baseUrl + '/ecosystem">' +
            '<span class="dw-footer-app-dot"></span>' +
            topApps[i].displayName +
            (topApps[i].isVerified ? ' <span class="dw-footer-check">&#10003;</span>' : '') +
          '</a></li>';
        }
        if (apps.length > cfg.maxApps) {
          html += '<li><a href="' + this.baseUrl + '/ecosystem" class="dw-footer-more">View all ' + apps.length + ' apps &rarr;</a></li>';
        }
        html += '</ul></div>';
      }

      html += '</div>';

      html += '<div class="dw-footer-bottom">' +
        '<span class="dw-footer-copy">&copy; ' + cfg.year + ' DarkWave Studios. All rights reserved.</span>' +
        '<div class="dw-footer-bottom-links">' +
          '<a href="' + this.baseUrl + '/terms">Terms</a>' +
          '<a href="' + this.baseUrl + '/privacy">Privacy</a>' +
          '<a href="' + this.baseUrl + '/developers">API</a>' +
        '</div>' +
        '<span class="dw-footer-powered">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dw-footer-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
          'Trust Layer Verified' +
        '</span>' +
      '</div>';

      html += '</div>';
      el.innerHTML = html;

      var target = document.getElementById('dw-shared-footer') || document.body;
      if (target === document.body) {
        document.body.appendChild(el);
      } else {
        target.parentNode.replaceChild(el, target);
      }
    },

    injectStyles: function() {
      if (document.getElementById('dw-shared-footer-styles')) return;
      var s = document.createElement('style');
      s.id = 'dw-shared-footer-styles';
      s.textContent = [
        '.dw-footer{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;width:100%;box-sizing:border-box}',
        '.dw-footer *{box-sizing:border-box;margin:0;padding:0}',
        '.dw-footer-dark{background:linear-gradient(180deg,#070714 0%,#0a0a1a 100%);color:#e5e7eb;border-top:1px solid rgba(6,182,212,0.15)}',
        '.dw-footer-light{background:#f9fafb;color:#374151;border-top:1px solid #e5e7eb}',
        '.dw-footer-inner{max-width:1200px;margin:0 auto;padding:48px 24px 24px}',
        '.dw-footer-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px}',
        '@media(max-width:900px){.dw-footer-grid{grid-template-columns:1fr 1fr;gap:32px}}',
        '@media(max-width:600px){.dw-footer-grid{grid-template-columns:1fr;gap:28px}}',
        '.dw-footer-brand{display:flex;align-items:center;gap:10px;margin-bottom:12px}',
        '.dw-footer-logo{width:28px;height:28px;color:#06b6d4}',
        '.dw-footer-brand-name{font-weight:700;font-size:18px;letter-spacing:-0.02em}',
        '.dw-footer-dark .dw-footer-brand-name{color:#fff}',
        '.dw-footer-tagline{font-size:13px;line-height:1.5;opacity:0.6;margin-bottom:16px;max-width:300px}',
        '.dw-footer-stats-row{display:flex;gap:8px;flex-wrap:wrap}',
        '.dw-footer-stat-pill{font-size:11px;padding:4px 10px;border-radius:20px;display:inline-flex;align-items:center;gap:4px}',
        '.dw-footer-dark .dw-footer-stat-pill{background:rgba(6,182,212,0.1);color:#06b6d4}',
        '.dw-footer-light .dw-footer-stat-pill{background:#e0f2fe;color:#0891b2}',
        '.dw-footer-stat-pill strong{font-weight:700}',
        '.dw-footer-heading{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:14px}',
        '.dw-footer-dark .dw-footer-heading{color:#06b6d4}',
        '.dw-footer-light .dw-footer-heading{color:#0891b2}',
        '.dw-footer-links{list-style:none;display:flex;flex-direction:column;gap:8px}',
        '.dw-footer-links a{text-decoration:none;font-size:13px;transition:color .15s,opacity .15s;display:inline-flex;align-items:center;gap:6px}',
        '.dw-footer-dark .dw-footer-links a{color:#9ca3af}',
        '.dw-footer-dark .dw-footer-links a:hover{color:#06b6d4}',
        '.dw-footer-light .dw-footer-links a{color:#6b7280}',
        '.dw-footer-light .dw-footer-links a:hover{color:#0891b2}',
        '.dw-footer-app-dot{width:6px;height:6px;border-radius:50%;background:#06b6d4;display:inline-block;flex-shrink:0}',
        '.dw-footer-check{color:#06b6d4;font-size:11px}',
        '.dw-footer-more{font-weight:600;font-size:12px!important}',
        '.dw-footer-dark .dw-footer-more{color:#06b6d4!important}',
        '.dw-footer-bottom{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);font-size:12px}',
        '.dw-footer-light .dw-footer-bottom{border-color:#e5e7eb}',
        '.dw-footer-copy{opacity:0.4}',
        '.dw-footer-bottom-links{display:flex;gap:16px}',
        '.dw-footer-bottom-links a{text-decoration:none;opacity:0.4;transition:opacity .15s}',
        '.dw-footer-dark .dw-footer-bottom-links a{color:#e5e7eb}',
        '.dw-footer-light .dw-footer-bottom-links a{color:#374151}',
        '.dw-footer-bottom-links a:hover{opacity:0.8}',
        '.dw-footer-powered{display:flex;align-items:center;gap:6px;opacity:0.5;font-size:11px}',
        '.dw-footer-shield{width:14px;height:14px;color:#06b6d4}'
      ].join('\n');
      document.head.appendChild(s);
    }
  };

  if (typeof window !== 'undefined') {
    window.DWSharedFooter = DW_SHARED_FOOTER;

    var autoInit = true;
    if (document.currentScript) {
      autoInit = document.currentScript.getAttribute('data-auto-init') !== 'false';
      var theme = document.currentScript.getAttribute('data-theme');
      var baseUrl = document.currentScript.getAttribute('data-base-url');
      if (theme) DW_SHARED_FOOTER.config.theme = theme;
      if (baseUrl) DW_SHARED_FOOTER.baseUrl = baseUrl;
    }

    if (autoInit) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          DW_SHARED_FOOTER.init();
        });
      } else {
        DW_SHARED_FOOTER.init();
      }
    }
  }
})();
