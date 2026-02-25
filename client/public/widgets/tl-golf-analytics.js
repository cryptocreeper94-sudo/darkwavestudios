/**
 * TrustLayer Self-Hosted Analytics Module Widget
 * Version: 1.0.0
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#8b5cf6';
  var containerId = currentScript.getAttribute('data-container') || 'tl-golf-analytics';
  var container = document.getElementById(containerId);
  if (!container) return;

  var kpis = [
    { label: 'Sessions', value: '12,847', change: '+18%', up: true, icon: '👤' },
    { label: 'Page Views', value: '48,392', change: '+24%', up: true, icon: '📄' },
    { label: 'Avg Duration', value: '4:32', change: '+0:45', up: true, icon: '⏱' },
    { label: 'Bounce Rate', value: '34%', change: '-5%', up: true, icon: '📊' },
    { label: 'UTM Sources', value: '8', change: '+2', up: true, icon: '🔗' },
    { label: 'Live Now', value: '47', change: '', up: true, icon: '🟢' }
  ];

  var chartData = [35, 42, 38, 55, 48, 62, 58, 71, 65, 78, 82, 74, 89, 85];
  var maxVal = Math.max.apply(null, chartData);

  var topPages = [
    { path: '/courses', views: '8,241', pct: 68 },
    { path: '/handicap', views: '5,102', pct: 42 },
    { path: '/swing-analysis', views: '3,847', pct: 32 },
    { path: '/tee-times', views: '2,918', pct: 24 }
  ];

  var css = '\
    .tl-ganalytics { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 400px; margin: 0 auto; background: linear-gradient(145deg, #1e1b4b, #2e1065, #3b0764); border-radius: 16px; overflow: hidden; color: #fff; }\
    .tl-ganalytics-header { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); }\
    .tl-ganalytics-title { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }\
    .tl-ganalytics-badge { font-size: 9px; background: rgba(139,92,246,0.3); border: 1px solid rgba(139,92,246,0.5); padding: 2px 8px; border-radius: 10px; font-weight: 600; }\
    .tl-ganalytics-live { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #34d399; }\
    .tl-ganalytics-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; animation: tl-ga-blink 1.5s infinite; }\
    @keyframes tl-ga-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }\
    .tl-ganalytics-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 12px 20px; }\
    .tl-ganalytics-kpi { padding: 10px 8px; background: rgba(255,255,255,0.05); border-radius: 10px; text-align: center; }\
    .tl-ganalytics-kpi-icon { font-size: 16px; margin-bottom: 4px; }\
    .tl-ganalytics-kpi-val { font-size: 16px; font-weight: 700; }\
    .tl-ganalytics-kpi-lbl { font-size: 9px; opacity: 0.5; margin-top: 2px; }\
    .tl-ganalytics-kpi-change { font-size: 10px; color: #34d399; margin-top: 2px; }\
    .tl-ganalytics-chart { padding: 0 20px 12px; }\
    .tl-ganalytics-chart-label { font-size: 11px; opacity: 0.5; margin-bottom: 8px; }\
    .tl-ganalytics-bars { display: flex; align-items: flex-end; gap: 3px; height: 60px; }\
    .tl-ganalytics-bar { flex: 1; border-radius: 3px 3px 0 0; background: linear-gradient(180deg, ' + primaryColor + ', rgba(139,92,246,0.3)); transition: height 0.3s; min-width: 4px; }\
    .tl-ganalytics-bar:hover { background: linear-gradient(180deg, #a78bfa, rgba(139,92,246,0.5)); }\
    .tl-ganalytics-pages { padding: 0 20px 16px; }\
    .tl-ganalytics-pages-title { font-size: 11px; opacity: 0.5; margin-bottom: 8px; }\
    .tl-ganalytics-page { display: flex; align-items: center; gap: 10px; padding: 6px 0; font-size: 12px; }\
    .tl-ganalytics-page-path { flex: 1; font-weight: 500; font-family: monospace; font-size: 11px; }\
    .tl-ganalytics-page-views { opacity: 0.6; font-size: 11px; width: 50px; text-align: right; }\
    .tl-ganalytics-page-bar-wrap { width: 80px; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }\
    .tl-ganalytics-page-bar { height: 100%; border-radius: 2px; background: linear-gradient(90deg, ' + primaryColor + ', #a78bfa); }\
    .tl-ganalytics-footer { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; border-top: 1px solid rgba(255,255,255,0.06); }\
    .tl-ganalytics-privacy { font-size: 10px; opacity: 0.5; display: flex; align-items: center; gap: 4px; }\
    .tl-ganalytics-powered { font-size: 10px; opacity: 0.4; }\
    .tl-ganalytics-powered a { color: #fff; text-decoration: none; }\
  ';

  function render() {
    if (!document.getElementById('tl-ganalytics-styles')) {
      var style = document.createElement('style');
      style.id = 'tl-ganalytics-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }

    var kpisHtml = kpis.map(function(k) {
      return '\
        <div class="tl-ganalytics-kpi">\
          <div class="tl-ganalytics-kpi-icon">' + k.icon + '</div>\
          <div class="tl-ganalytics-kpi-val">' + k.value + '</div>\
          <div class="tl-ganalytics-kpi-lbl">' + k.label + '</div>\
          ' + (k.change ? '<div class="tl-ganalytics-kpi-change">' + k.change + '</div>' : '') + '\
        </div>';
    }).join('');

    var barsHtml = chartData.map(function(v) {
      var h = Math.round((v / maxVal) * 100);
      return '<div class="tl-ganalytics-bar" style="height:' + h + '%"></div>';
    }).join('');

    var pagesHtml = topPages.map(function(p) {
      return '\
        <div class="tl-ganalytics-page">\
          <div class="tl-ganalytics-page-path">' + p.path + '</div>\
          <div class="tl-ganalytics-page-views">' + p.views + '</div>\
          <div class="tl-ganalytics-page-bar-wrap"><div class="tl-ganalytics-page-bar" style="width:' + p.pct + '%"></div></div>\
        </div>';
    }).join('');

    container.innerHTML = '\
      <div class="tl-ganalytics">\
        <div class="tl-ganalytics-header">\
          <div class="tl-ganalytics-title">📊 Analytics</div>\
          <div class="tl-ganalytics-live"><span class="tl-ganalytics-dot"></span> <span class="tl-ganalytics-badge">Self-Hosted</span></div>\
        </div>\
        <div class="tl-ganalytics-kpis">' + kpisHtml + '</div>\
        <div class="tl-ganalytics-chart">\
          <div class="tl-ganalytics-chart-label">Daily Sessions — Last 14 Days</div>\
          <div class="tl-ganalytics-bars">' + barsHtml + '</div>\
        </div>\
        <div class="tl-ganalytics-pages">\
          <div class="tl-ganalytics-pages-title">Top Pages</div>\
          ' + pagesHtml + '\
        </div>\
        <div class="tl-ganalytics-footer">\
          <div class="tl-ganalytics-privacy">🔒 No cookies · First-party only</div>\
          <div class="tl-ganalytics-powered"><a href="https://trustgolf.app" target="_blank">Trust Golf</a></div>\
        </div>\
      </div>\
    ';
  }

  render();
  console.log('[TL Golf Analytics] Widget loaded');
})();
