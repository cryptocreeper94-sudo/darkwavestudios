/**
 * TrustLayer Signal Chat Widget
 * Version: 1.0.0
 * Embeddable community chat with real-time messaging
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#06b6d4';
  var containerId = currentScript.getAttribute('data-container') || 'tl-signal-chat';
  var channelName = currentScript.getAttribute('data-channel') || 'general';
  var theme = currentScript.getAttribute('data-theme') || 'dark';
  var position = currentScript.getAttribute('data-position') || 'bottom-right';
  var container = document.getElementById(containerId);

  if (!container) {
    console.warn('[Signal Chat] Container not found:', containerId);
    return;
  }

  var isDark = theme === 'dark';
  var bgPrimary = isDark ? '#0f172a' : '#ffffff';
  var bgSecondary = isDark ? '#1e293b' : '#f8fafc';
  var bgTertiary = isDark ? '#334155' : '#f1f5f9';
  var textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  var textSecondary = isDark ? '#94a3b8' : '#64748b';
  var borderColor = isDark ? '#334155' : '#e2e8f0';

  var css = '\
    .sc-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; border-radius: 16px; overflow: hidden; border: 1px solid ' + borderColor + '; background: ' + bgPrimary + '; display: flex; flex-direction: column; height: 480px; box-shadow: 0 20px 60px rgba(0,0,0,' + (isDark ? '0.5' : '0.15') + '); }\
    .sc-header { display: flex; align-items: center; gap: 12px; padding: 16px; border-bottom: 1px solid ' + borderColor + '; background: ' + bgSecondary + '; }\
    .sc-header-icon { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, ' + primaryColor + ', #3b82f6); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: 700; }\
    .sc-header-info { flex: 1; }\
    .sc-header-name { font-weight: 700; font-size: 14px; color: ' + textPrimary + '; }\
    .sc-header-status { font-size: 11px; color: #10b981; display: flex; align-items: center; gap: 4px; }\
    .sc-header-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; }\
    .sc-channel-bar { display: flex; gap: 4px; padding: 8px 16px; background: ' + bgSecondary + '; border-bottom: 1px solid ' + borderColor + '; overflow-x: auto; }\
    .sc-channel-btn { padding: 4px 10px; border-radius: 8px; font-size: 11px; border: none; cursor: pointer; white-space: nowrap; transition: all 0.2s; background: transparent; color: ' + textSecondary + '; }\
    .sc-channel-btn:hover { background: ' + bgTertiary + '; }\
    .sc-channel-btn.active { background: ' + primaryColor + '20; color: ' + primaryColor + '; font-weight: 600; }\
    .sc-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }\
    .sc-messages::-webkit-scrollbar { width: 4px; }\
    .sc-messages::-webkit-scrollbar-thumb { background: ' + borderColor + '; border-radius: 2px; }\
    .sc-msg { display: flex; gap: 10px; align-items: flex-start; }\
    .sc-msg-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 700; flex-shrink: 0; }\
    .sc-msg-body { flex: 1; min-width: 0; }\
    .sc-msg-header { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }\
    .sc-msg-name { font-weight: 600; font-size: 13px; color: ' + textPrimary + '; }\
    .sc-msg-name.bot { color: #10b981; }\
    .sc-msg-time { font-size: 10px; color: ' + textSecondary + '; }\
    .sc-msg-text { font-size: 13px; color: ' + (isDark ? '#cbd5e1' : '#475569') + '; line-height: 1.5; }\
    .sc-msg-reactions { display: flex; gap: 4px; margin-top: 4px; }\
    .sc-msg-reaction { font-size: 10px; padding: 2px 6px; border-radius: 10px; background: ' + bgTertiary + '; border: 1px solid ' + borderColor + '; cursor: pointer; }\
    .sc-msg-reaction:hover { border-color: ' + primaryColor + '; }\
    .sc-typing { font-size: 11px; color: ' + primaryColor + '; padding: 0 16px 4px; opacity: 0.8; }\
    .sc-input-bar { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid ' + borderColor + '; background: ' + bgSecondary + '; }\
    .sc-input { flex: 1; padding: 10px 14px; border-radius: 10px; border: 1px solid ' + borderColor + '; background: ' + bgPrimary + '; color: ' + textPrimary + '; font-size: 13px; outline: none; transition: border-color 0.2s; }\
    .sc-input:focus { border-color: ' + primaryColor + '; }\
    .sc-input::placeholder { color: ' + textSecondary + '; }\
    .sc-send-btn { width: 38px; height: 38px; border-radius: 10px; border: none; background: linear-gradient(135deg, ' + primaryColor + ', #3b82f6); color: white; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.15s, box-shadow 0.2s; }\
    .sc-send-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px ' + primaryColor + '60; }\
    .sc-powered { text-align: center; font-size: 10px; color: ' + textSecondary + '; padding: 6px; }\
    .sc-powered a { color: ' + primaryColor + '; text-decoration: none; font-weight: 500; }\
  ';

  var CHANNELS = ['# general', '# support', '# dev', '# random'];
  var activeChannel = 0;

  var SAMPLE_MESSAGES = [
    { user: 'Sarah K.', avatar: 'SK', color: '#ec4899', text: 'The new widget just shipped! \u{1F680}', time: '2:31 PM', reactions: ['\u{1F389} 3', '\u{1F44D} 5'] },
    { user: '\u{1F916} BuildBot', avatar: '\u{1F916}', color: '#10b981', text: 'Build #847 passed all tests \u2705', time: '2:33 PM', isBot: true },
    { user: 'Alex M.', avatar: 'AM', color: '#3b82f6', text: 'Love the new dark mode theme. The gradients look incredible on mobile too.', time: '2:35 PM', reactions: ['\u{1F525} 2'] },
    { user: 'Jordan L.', avatar: 'JL', color: '#8b5cf6', text: 'Just pushed the WebSocket reconnect fix - should be much smoother now', time: '2:38 PM' },
    { user: 'Casey R.', avatar: 'CR', color: '#f59e0b', text: 'Has anyone tested the bot framework with custom slash commands yet?', time: '2:41 PM' }
  ];

  function injectStyles() {
    if (document.getElementById('sc-styles')) return;
    var style = document.createElement('style');
    style.id = 'sc-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function renderMessage(msg) {
    var reactionsHtml = '';
    if (msg.reactions) {
      reactionsHtml = '<div class="sc-msg-reactions">' +
        msg.reactions.map(function(r) { return '<span class="sc-msg-reaction">' + r + '</span>'; }).join('') +
      '</div>';
    }
    return '<div class="sc-msg">' +
      '<div class="sc-msg-avatar" style="background: ' + msg.color + '">' + msg.avatar + '</div>' +
      '<div class="sc-msg-body">' +
        '<div class="sc-msg-header">' +
          '<span class="sc-msg-name' + (msg.isBot ? ' bot' : '') + '">' + msg.user + '</span>' +
          '<span class="sc-msg-time">' + msg.time + '</span>' +
        '</div>' +
        '<div class="sc-msg-text">' + msg.text + '</div>' +
        reactionsHtml +
      '</div>' +
    '</div>';
  }

  function renderChannels() {
    return CHANNELS.map(function(ch, i) {
      return '<button class="sc-channel-btn' + (i === activeChannel ? ' active' : '') + '" data-channel="' + i + '">' + ch + '</button>';
    }).join('');
  }

  function render() {
    injectStyles();

    container.innerHTML = '\
      <div class="sc-container">\
        <div class="sc-header">\
          <div class="sc-header-icon">\u26A1</div>\
          <div class="sc-header-info">\
            <div class="sc-header-name">Signal Chat</div>\
            <div class="sc-header-status"><span class="sc-header-dot"></span> 24 online</div>\
          </div>\
        </div>\
        <div class="sc-channel-bar">' + renderChannels() + '</div>\
        <div class="sc-messages">' + SAMPLE_MESSAGES.map(renderMessage).join('') + '</div>\
        <div class="sc-typing">\u270D\uFE0F Mike is typing...</div>\
        <div class="sc-input-bar">\
          <input class="sc-input" placeholder="Message ' + CHANNELS[activeChannel] + '..." />\
          <button class="sc-send-btn">\u2191</button>\
        </div>\
        <div class="sc-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
    ';

    var channelBtns = container.querySelectorAll('.sc-channel-btn');
    channelBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        activeChannel = parseInt(this.getAttribute('data-channel'));
        render();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  window.TLSignalChat = { refresh: render };
  console.log('[Signal Chat] v1.0.0 loaded for site:', siteId);
})();
