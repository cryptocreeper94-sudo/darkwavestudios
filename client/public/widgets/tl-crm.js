/**
 * TrustLayer CRM Pipeline Widget
 * Version: 1.0.0
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var containerId = currentScript.getAttribute('data-container') || 'tl-crm';
  var webhookUrl = currentScript.getAttribute('data-webhook-url');
  var container = document.getElementById(containerId);
  if (!container) {
    console.warn('[TL CRM] Container not found:', containerId);
    return;
  }
  var STAGES = [
    { id: 'new', name: 'New Leads', color: '#6b7280' },
    { id: 'contacted', name: 'Contacted', color: '#3b82f6' },
    { id: 'quoted', name: 'Quoted', color: '#f59e0b' },
    { id: 'won', name: 'Won', color: '#10b981' }
  ];
  var leads = [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '615-555-0101', stage: 'new', value: 2500, created: '2026-01-28' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '615-555-0102', stage: 'contacted', value: 4200, created: '2026-01-27' },
    { id: 3, name: 'Mike Davis', email: 'mike@example.com', phone: '615-555-0103', stage: 'quoted', value: 3800, created: '2026-01-26' },
    { id: 4, name: 'Emily Wilson', email: 'emily@example.com', phone: '615-555-0104', stage: 'quoted', value: 5100, created: '2026-01-25' },
    { id: 5, name: 'Robert Brown', email: 'robert@example.com', phone: '615-555-0105', stage: 'won', value: 6200, created: '2026-01-24' }
  ];
  var css = '\
    .tl-crm-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f9fafb; border-radius: 12px; padding: 20px; }\
    .tl-crm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }\
    .tl-crm-title { font-size: 20px; font-weight: 700; color: #1f2937; }\
    .tl-crm-stats { display: flex; gap: 16px; }\
    .tl-crm-stat { text-align: center; }\
    .tl-crm-stat-value { font-size: 24px; font-weight: 700; color: ' + primaryColor + '; }\
    .tl-crm-stat-label { font-size: 12px; color: #6b7280; }\
    .tl-crm-board { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; }\
    .tl-crm-column { flex: 0 0 280px; background: #fff; border-radius: 10px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }\
    .tl-crm-column-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 2px solid #e5e7eb; }\
    .tl-crm-column-title { font-weight: 600; color: #374151; display: flex; align-items: center; gap: 8px; }\
    .tl-crm-column-dot { width: 10px; height: 10px; border-radius: 50%; }\
    .tl-crm-column-count { font-size: 12px; color: #9ca3af; background: #f3f4f6; padding: 2px 8px; border-radius: 10px; }\
    .tl-crm-cards { display: flex; flex-direction: column; gap: 8px; min-height: 100px; }\
    .tl-crm-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; cursor: grab; transition: box-shadow 0.2s; }\
    .tl-crm-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }\
    .tl-crm-card.dragging { opacity: 0.5; }\
    .tl-crm-card-name { font-weight: 600; color: #1f2937; margin-bottom: 4px; }\
    .tl-crm-card-email { font-size: 13px; color: #6b7280; margin-bottom: 8px; }\
    .tl-crm-card-footer { display: flex; justify-content: space-between; align-items: center; }\
    .tl-crm-card-value { font-size: 14px; font-weight: 600; color: ' + primaryColor + '; }\
    .tl-crm-card-date { font-size: 12px; color: #9ca3af; }\
    .tl-crm-powered { text-align: center; font-size: 11px; color: #9ca3af; margin-top: 16px; }\
    .tl-crm-powered a { color: ' + primaryColor + '; text-decoration: none; }\
  ';
  function injectStyles() {
    if (document.getElementById('tl-crm-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-crm-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }
  function formatCurrency(amount) {
    return '$' + amount.toLocaleString();
  }
  function formatDate(dateStr) {
    var date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  function getLeadsByStage(stageId) {
    return leads.filter(function(l) { return l.stage === stageId; });
  }
  function getTotalValue() {
    return leads.reduce(function(sum, l) { return sum + l.value; }, 0);
  }
  function sendWebhook(data) {
    if (!webhookUrl) return;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', webhookUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      event: 'crm.lead_moved',
      siteId: siteId,
      timestamp: new Date().toISOString(),
      data: data
    }));
  }
  function render() {
    injectStyles();
    var columnsHtml = STAGES.map(function(stage) {
      var stageLeads = getLeadsByStage(stage.id);
      var cardsHtml = stageLeads.map(function(lead) {
        return '<div class="tl-crm-card" draggable="true" data-lead-id="' + lead.id + '">\
          <div class="tl-crm-card-name">' + lead.name + '</div>\
          <div class="tl-crm-card-email">' + lead.email + '</div>\
          <div class="tl-crm-card-footer">\
            <span class="tl-crm-card-value">' + formatCurrency(lead.value) + '</span>\
            <span class="tl-crm-card-date">' + formatDate(lead.created) + '</span>\
          </div>\
        </div>';
      }).join('');
      return '<div class="tl-crm-column" data-stage="' + stage.id + '">\
        <div class="tl-crm-column-header">\
          <div class="tl-crm-column-title">\
            <span class="tl-crm-column-dot" style="background:' + stage.color + '"></span>\
            ' + stage.name + '\
          </div>\
          <span class="tl-crm-column-count">' + stageLeads.length + '</span>\
        </div>\
        <div class="tl-crm-cards">' + cardsHtml + '</div>\
      </div>';
    }).join('');
    container.innerHTML = '\
      <div class="tl-crm-container">\
        <div class="tl-crm-header">\
          <div class="tl-crm-title">Sales Pipeline</div>\
          <div class="tl-crm-stats">\
            <div class="tl-crm-stat"><div class="tl-crm-stat-value">' + leads.length + '</div><div class="tl-crm-stat-label">Total Leads</div></div>\
            <div class="tl-crm-stat"><div class="tl-crm-stat-value">' + formatCurrency(getTotalValue()) + '</div><div class="tl-crm-stat-label">Pipeline Value</div></div>\
          </div>\
        </div>\
        <div class="tl-crm-board">' + columnsHtml + '</div>\
        <div class="tl-crm-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
    ';
    bindDragEvents();
  }
  function bindDragEvents() {
    var cards = container.querySelectorAll('.tl-crm-card');
    var columns = container.querySelectorAll('.tl-crm-column');
    cards.forEach(function(card) {
      card.addEventListener('dragstart', function(e) {
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', card.getAttribute('data-lead-id'));
      });
      card.addEventListener('dragend', function() {
        card.classList.remove('dragging');
      });
    });
    columns.forEach(function(column) {
      column.addEventListener('dragover', function(e) {
        e.preventDefault();
      });
      column.addEventListener('drop', function(e) {
        e.preventDefault();
        var leadId = parseInt(e.dataTransfer.getData('text/plain'));
        var newStage = column.getAttribute('data-stage');
        
        var lead = leads.find(function(l) { return l.id === leadId; });
        if (lead && lead.stage !== newStage) {
          var oldStage = lead.stage;
          lead.stage = newStage;
          render();
          sendWebhook({ leadId: leadId, from: oldStage, to: newStage });
          
          if (window.TLAnalytics) {
            window.TLAnalytics.track('crm_lead_moved', { leadId: leadId, from: oldStage, to: newStage });
          }
        }
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
  window.TLCRM = {
    refresh: render,
    getLeads: function() { return leads; },
    addLead: function(lead) { leads.push(lead); render(); }
  };
  console.log('[TL CRM] Loaded for site:', siteId);
})();
