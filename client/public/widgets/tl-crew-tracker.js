/**
 * TrustLayer Crew Tracker Widget
 * Version: 1.0.0
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var containerId = currentScript.getAttribute('data-container') || 'tl-crew-tracker';
  var jobId = currentScript.getAttribute('data-job-id');
  var container = document.getElementById(containerId);
  if (!container) {
    console.warn('[TL Crew Tracker] Container not found:', containerId);
    return;
  }
  function adjustColor(hex, percent) {
    var num = parseInt(hex.replace('#', ''), 16);
    var r = Math.min(255, Math.max(0, (num >> 16) + percent));
    var g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    var b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  }
  var css = '\
    .tl-crew-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 400px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }\
    .tl-crew-header { background: linear-gradient(135deg, ' + primaryColor + ' 0%, ' + adjustColor(primaryColor, -30) + ' 100%); color: #fff; padding: 20px; }\
    .tl-crew-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; }\
    .tl-crew-job { font-size: 14px; opacity: 0.9; }\
    .tl-crew-map { height: 200px; background: #e5e7eb; position: relative; }\
    .tl-crew-map-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 14px; }\
    .tl-crew-info { padding: 20px; }\
    .tl-crew-status { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }\
    .tl-crew-status-dot { width: 12px; height: 12px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite; }\
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }\
    .tl-crew-status-text { font-weight: 600; color: #1f2937; }\
    .tl-crew-eta { font-size: 14px; color: #6b7280; }\
    .tl-crew-details { border-top: 1px solid #e5e7eb; padding-top: 16px; }\
    .tl-crew-detail { display: flex; justify-content: space-between; margin-bottom: 12px; }\
    .tl-crew-detail-label { font-size: 14px; color: #6b7280; }\
    .tl-crew-detail-value { font-size: 14px; font-weight: 600; color: #1f2937; }\
    .tl-crew-member { display: flex; align-items: center; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; margin-bottom: 8px; }\
    .tl-crew-avatar { width: 40px; height: 40px; border-radius: 50%; background: ' + primaryColor + '; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; }\
    .tl-crew-name { font-weight: 600; color: #1f2937; }\
    .tl-crew-role { font-size: 12px; color: #6b7280; }\
    .tl-crew-contact { display: flex; gap: 8px; margin-top: 16px; }\
    .tl-crew-btn { flex: 1; padding: 12px; font-size: 14px; font-weight: 600; border-radius: 8px; cursor: pointer; text-align: center; text-decoration: none; }\
    .tl-crew-btn-call { background: ' + primaryColor + '; color: #fff; border: none; }\
    .tl-crew-btn-text { background: #fff; color: ' + primaryColor + '; border: 2px solid ' + primaryColor + '; }\
    .tl-crew-powered { text-align: center; font-size: 11px; color: #9ca3af; padding: 12px; }\
    .tl-crew-powered a { color: ' + primaryColor + '; text-decoration: none; }\
  ';
  var SAMPLE_DATA = {
    job: { id: jobId || 'JOB-001', address: '123 Main St, Nashville, TN' },
    status: 'En Route',
    eta: '15 minutes',
    crew: [
      { name: 'Mike Johnson', role: 'Crew Lead', phone: '615-555-0101' },
      { name: 'Sarah Williams', role: 'Painter', phone: '615-555-0102' }
    ],
    lastUpdate: new Date()
  };
  function injectStyles() {
    if (document.getElementById('tl-crew-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-crew-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }
  function getInitials(name) {
    return name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase();
  }
  function render() {
    injectStyles();
    
    var data = SAMPLE_DATA;
    var crewHtml = data.crew.map(function(c) {
      return '<div class="tl-crew-member">\
        <div class="tl-crew-avatar">' + getInitials(c.name) + '</div>\
        <div><div class="tl-crew-name">' + c.name + '</div><div class="tl-crew-role">' + c.role + '</div></div>\
      </div>';
    }).join('');
    container.innerHTML = '\
      <div class="tl-crew-container">\
        <div class="tl-crew-header">\
          <div class="tl-crew-title">Your Crew is on the Way!</div>\
          <div class="tl-crew-job">' + data.job.address + '</div>\
        </div>\
        <div class="tl-crew-map"><div class="tl-crew-map-placeholder">Map Loading...</div></div>\
        <div class="tl-crew-info">\
          <div class="tl-crew-status">\
            <div class="tl-crew-status-dot"></div>\
            <div>\
              <div class="tl-crew-status-text">' + data.status + '</div>\
              <div class="tl-crew-eta">ETA: ' + data.eta + '</div>\
            </div>\
          </div>\
          <div class="tl-crew-details">\
            <div class="tl-crew-detail"><span class="tl-crew-detail-label">Job #</span><span class="tl-crew-detail-value">' + data.job.id + '</span></div>\
            <div class="tl-crew-detail"><span class="tl-crew-detail-label">Crew Size</span><span class="tl-crew-detail-value">' + data.crew.length + ' members</span></div>\
          </div>\
          <div style="margin-top:16px;font-weight:600;color:#374151;margin-bottom:8px;">Your Team</div>\
          ' + crewHtml + '\
          <div class="tl-crew-contact">\
            <a href="tel:' + data.crew[0].phone + '" class="tl-crew-btn tl-crew-btn-call">Call Crew Lead</a>\
            <a href="sms:' + data.crew[0].phone + '" class="tl-crew-btn tl-crew-btn-text">Send Text</a>\
          </div>\
        </div>\
        <div class="tl-crew-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
    ';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
  window.TLCrewTracker = { refresh: render };
  console.log('[TL Crew Tracker] Loaded for site:', siteId);
})();
