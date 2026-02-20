(function() {
  'use strict';

  const DW_ECOSYSTEM_WIDGET = {
    baseUrl: '',
    container: null,
    data: null,
    config: {
      theme: 'dark',
      size: 'standard',
      showApps: true,
      showStats: true,
      showBadge: true,
      maxApps: 6
    },

    init: function(options) {
      this.baseUrl = options.baseUrl || window.location.origin;
      Object.assign(this.config, options.config || {});
      
      const target = options.target || '#dw-ecosystem-widget';
      this.container = typeof target === 'string' ? document.querySelector(target) : target;
      
      if (!this.container) {
        console.warn('[DW Ecosystem Widget] Target container not found:', target);
        return;
      }

      this.injectStyles();
      this.render('loading');
      this.fetchData(options.token);
    },

    fetchData: function(token) {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;

      fetch(this.baseUrl + '/api/ecosystem/widget-data', { headers: headers })
        .then(function(res) { return res.json(); })
        .then(function(data) {
          if (data.success) {
            DW_ECOSYSTEM_WIDGET.data = data;
            DW_ECOSYSTEM_WIDGET.render('loaded');
          } else {
            DW_ECOSYSTEM_WIDGET.render('error');
          }
        })
        .catch(function() {
          DW_ECOSYSTEM_WIDGET.render('error');
        });
    },

    render: function(state) {
      if (!this.container) return;
      var html = '';

      if (state === 'loading') {
        html = this.renderLoading();
      } else if (state === 'error') {
        html = this.renderError();
      } else {
        html = this.renderWidget();
      }

      this.container.innerHTML = html;
    },

    renderLoading: function() {
      return '<div class="dw-eco-widget dw-eco-' + this.config.theme + '">' +
        '<div class="dw-eco-loading">' +
          '<div class="dw-eco-spinner"></div>' +
          '<span>Loading ecosystem data...</span>' +
        '</div>' +
      '</div>';
    },

    renderError: function() {
      return '<div class="dw-eco-widget dw-eco-' + this.config.theme + '">' +
        '<div class="dw-eco-error">' +
          '<span>Unable to load ecosystem data</span>' +
        '</div>' +
      '</div>';
    },

    renderWidget: function() {
      var d = this.data;
      var cfg = this.config;
      var html = '<div class="dw-eco-widget dw-eco-' + cfg.theme + '">';

      if (cfg.showBadge) {
        html += '<div class="dw-eco-header">' +
          '<div class="dw-eco-badge">' +
            '<svg class="dw-eco-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>' +
            '<div class="dw-eco-badge-text">' +
              '<span class="dw-eco-title">DarkWave Trust Layer</span>' +
              '<span class="dw-eco-verified">Verified Ecosystem</span>' +
            '</div>' +
          '</div>' +
        '</div>';
      }

      if (cfg.showStats && d.stats) {
        html += '<div class="dw-eco-stats">' +
          '<div class="dw-eco-stat">' +
            '<span class="dw-eco-stat-value">' + d.stats.totalApps + '</span>' +
            '<span class="dw-eco-stat-label">Apps</span>' +
          '</div>' +
          '<div class="dw-eco-stat">' +
            '<span class="dw-eco-stat-value">' + d.stats.verifiedApps + '</span>' +
            '<span class="dw-eco-stat-label">Verified</span>' +
          '</div>' +
          '<div class="dw-eco-stat">' +
            '<span class="dw-eco-stat-value">' + d.stats.totalWidgets + '</span>' +
            '<span class="dw-eco-stat-label">Widgets</span>' +
          '</div>' +
          '<div class="dw-eco-stat">' +
            '<span class="dw-eco-stat-value">' + d.stats.totalLOC + '</span>' +
            '<span class="dw-eco-stat-label">Lines of Code</span>' +
          '</div>' +
        '</div>';
      }

      if (cfg.showApps && d.apps && d.apps.length > 0) {
        var appsToShow = d.apps.slice(0, cfg.maxApps);
        html += '<div class="dw-eco-apps">';
        for (var i = 0; i < appsToShow.length; i++) {
          var app = appsToShow[i];
          html += '<div class="dw-eco-app">' +
            '<div class="dw-eco-app-icon">' + (app.icon || app.displayName.charAt(0)) + '</div>' +
            '<div class="dw-eco-app-info">' +
              '<span class="dw-eco-app-name">' + app.displayName + '</span>' +
              '<span class="dw-eco-app-desc">' + (app.description || '') + '</span>' +
            '</div>' +
            (app.isVerified ? '<span class="dw-eco-app-check">&#10003;</span>' : '') +
          '</div>';
        }
        if (d.apps.length > cfg.maxApps) {
          html += '<div class="dw-eco-more">+' + (d.apps.length - cfg.maxApps) + ' more apps</div>';
        }
        html += '</div>';
      }

      html += '<div class="dw-eco-footer">' +
        '<a href="https://dwsc.io/ecosystem" target="_blank" rel="noopener" class="dw-eco-link">Explore Ecosystem</a>' +
        '<span class="dw-eco-powered">Powered by DarkWave Trust Layer</span>' +
      '</div>';

      html += '</div>';
      return html;
    },

    injectStyles: function() {
      if (document.getElementById('dw-ecosystem-styles')) return;
      var style = document.createElement('style');
      style.id = 'dw-ecosystem-styles';
      style.textContent = [
        '.dw-eco-widget{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;border-radius:12px;overflow:hidden;max-width:400px;width:100%}',
        '.dw-eco-dark{background:linear-gradient(135deg,#0a0a1a 0%,#111827 100%);color:#e5e7eb;border:1px solid rgba(6,182,212,0.2)}',
        '.dw-eco-light{background:#fff;color:#1f2937;border:1px solid #e5e7eb;box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}',
        '.dw-eco-header{padding:16px 16px 12px;display:flex;align-items:center}',
        '.dw-eco-badge{display:flex;align-items:center;gap:10px}',
        '.dw-eco-logo{width:28px;height:28px;color:#06b6d4}',
        '.dw-eco-badge-text{display:flex;flex-direction:column}',
        '.dw-eco-title{font-weight:700;font-size:14px;letter-spacing:-0.01em}',
        '.dw-eco-dark .dw-eco-title{color:#fff}',
        '.dw-eco-verified{font-size:11px;color:#06b6d4;font-weight:500;display:flex;align-items:center;gap:4px}',
        '.dw-eco-verified::before{content:"\\2713";font-size:10px;background:#06b6d4;color:#000;border-radius:50%;width:14px;height:14px;display:inline-flex;align-items:center;justify-content:center}',
        '.dw-eco-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:0 16px 12px}',
        '.dw-eco-stat{text-align:center;padding:8px 4px;border-radius:8px}',
        '.dw-eco-dark .dw-eco-stat{background:rgba(6,182,212,0.08)}',
        '.dw-eco-light .dw-eco-stat{background:#f3f4f6}',
        '.dw-eco-stat-value{display:block;font-weight:700;font-size:16px}',
        '.dw-eco-dark .dw-eco-stat-value{color:#06b6d4}',
        '.dw-eco-light .dw-eco-stat-value{color:#0891b2}',
        '.dw-eco-stat-label{font-size:10px;opacity:0.7;text-transform:uppercase;letter-spacing:0.05em}',
        '.dw-eco-apps{padding:0 16px 12px;display:flex;flex-direction:column;gap:6px}',
        '.dw-eco-app{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;transition:background .15s}',
        '.dw-eco-dark .dw-eco-app:hover{background:rgba(255,255,255,0.05)}',
        '.dw-eco-light .dw-eco-app:hover{background:#f9fafb}',
        '.dw-eco-app-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0}',
        '.dw-eco-dark .dw-eco-app-icon{background:linear-gradient(135deg,#06b6d4,#8b5cf6);color:#fff}',
        '.dw-eco-light .dw-eco-app-icon{background:linear-gradient(135deg,#0891b2,#7c3aed);color:#fff}',
        '.dw-eco-app-info{flex:1;min-width:0}',
        '.dw-eco-app-name{display:block;font-weight:600;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
        '.dw-eco-app-desc{display:block;font-size:10px;opacity:0.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
        '.dw-eco-app-check{color:#06b6d4;font-size:14px;flex-shrink:0}',
        '.dw-eco-more{text-align:center;font-size:11px;opacity:0.5;padding:4px}',
        '.dw-eco-footer{padding:12px 16px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.06)}',
        '.dw-eco-light .dw-eco-footer{border-color:#e5e7eb}',
        '.dw-eco-link{font-size:12px;color:#06b6d4;text-decoration:none;font-weight:600;transition:opacity .15s}',
        '.dw-eco-link:hover{opacity:0.8}',
        '.dw-eco-powered{font-size:10px;opacity:0.4}',
        '.dw-eco-loading{padding:40px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;font-size:12px;opacity:0.6}',
        '.dw-eco-spinner{width:24px;height:24px;border:2px solid rgba(6,182,212,0.2);border-top-color:#06b6d4;border-radius:50%;animation:dw-spin .8s linear infinite}',
        '.dw-eco-error{padding:24px;text-align:center;font-size:12px;opacity:0.5}',
        '@keyframes dw-spin{to{transform:rotate(360deg)}}'
      ].join('\n');
      document.head.appendChild(style);
    }
  };

  if (typeof window !== 'undefined') {
    window.DWEcosystemWidget = DW_ECOSYSTEM_WIDGET;

    if (document.currentScript) {
      var autoTarget = document.currentScript.getAttribute('data-target');
      var autoToken = document.currentScript.getAttribute('data-token');
      var autoTheme = document.currentScript.getAttribute('data-theme');
      var autoSize = document.currentScript.getAttribute('data-size');

      if (autoTarget) {
        document.addEventListener('DOMContentLoaded', function() {
          DW_ECOSYSTEM_WIDGET.init({
            baseUrl: document.currentScript ? document.currentScript.src.replace(/\/widgets\/tl-ecosystem\.js.*$/, '') : window.location.origin,
            target: autoTarget,
            token: autoToken,
            config: {
              theme: autoTheme || 'dark',
              size: autoSize || 'standard'
            }
          });
        });
      }
    }
  }
})();
