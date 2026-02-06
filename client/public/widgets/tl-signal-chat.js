/**
 * TrustLayer Signal Chat Widget
 * Version: 2.0.0
 * Cross-ecosystem community chat with SSO, bots & subscription billing
 *
 * Usage:
 *   <div id="tl-signal-chat"></div>
 *   <script src="tl-signal-chat.js"
 *     data-site-id="YOUR_SITE_ID"
 *     data-api-key="YOUR_API_KEY"
 *     data-channel="dws-support"
 *     data-theme="dark"
 *     data-primary-color="#06b6d4">
 *   </script>
 *
 * React integration:
 *   <ChatContainer channelId="garagebot-support" />
 *   Users authenticate through Trust Layer SSO automatically.
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#06b6d4';
  var containerId = currentScript.getAttribute('data-container') || 'tl-signal-chat';
  var channelName = currentScript.getAttribute('data-channel') || 'dws-support';
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
    .sc-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; border-radius: 16px; overflow: hidden; border: 1px solid ' + borderColor + '; background: ' + bgPrimary + '; display: flex; flex-direction: column; height: 520px; box-shadow: 0 20px 60px rgba(0,0,0,' + (isDark ? '0.5' : '0.15') + '); }\
    .sc-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid ' + borderColor + '; background: ' + bgSecondary + '; }\
    .sc-header-icon { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, ' + primaryColor + ', #3b82f6); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: 700; }\
    .sc-header-info { flex: 1; }\
    .sc-header-name { font-weight: 700; font-size: 14px; color: ' + textPrimary + '; }\
    .sc-header-status { font-size: 11px; color: #10b981; display: flex; align-items: center; gap: 4px; }\
    .sc-header-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; }\
    .sc-header-badges { display: flex; gap: 4px; }\
    .sc-badge { padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 600; }\
    .sc-badge-sso { background: ' + (isDark ? 'rgba(139,92,246,0.2)' : '#ede9fe') + '; color: ' + (isDark ? '#a78bfa' : '#7c3aed') + '; border: 1px solid ' + (isDark ? 'rgba(139,92,246,0.3)' : 'transparent') + '; }\
    .sc-badge-live { background: ' + primaryColor + '20; color: ' + primaryColor + '; border: 1px solid ' + primaryColor + '40; }\
    .sc-sidebar { display: flex; }\
    .sc-channels { width: 140px; padding: 10px 8px; background: ' + bgSecondary + '; border-right: 1px solid ' + borderColor + '; overflow-y: auto; }\
    .sc-ch-section { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; margin-top: 8px; }\
    .sc-ch-section:first-child { margin-top: 0; }\
    .sc-ch-section-eco { color: ' + primaryColor + '; opacity: 0.7; }\
    .sc-ch-section-app { color: ' + (isDark ? '#a78bfa' : '#7c3aed') + '; opacity: 0.7; }\
    .sc-ch-section-dm { color: #10b981; opacity: 0.7; }\
    .sc-ch-item { font-size: 11px; padding: 5px 8px; border-radius: 6px; cursor: pointer; transition: all 0.2s; color: ' + textSecondary + '; display: flex; align-items: center; gap: 4px; }\
    .sc-ch-item:hover { background: ' + bgTertiary + '; color: ' + textPrimary + '; }\
    .sc-ch-item.active { background: ' + primaryColor + '20; color: ' + primaryColor + '; font-weight: 600; }\
    .sc-ch-badge { font-size: 8px; padding: 1px 4px; border-radius: 4px; margin-left: auto; background: ' + primaryColor + '30; color: ' + primaryColor + '; font-weight: 600; }\
    .sc-dm-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }\
    .sc-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }\
    .sc-topic-bar { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-bottom: 1px solid ' + borderColor + '; background: ' + bgSecondary + '; }\
    .sc-topic-name { font-size: 12px; font-weight: 600; color: ' + primaryColor + '; }\
    .sc-topic-sep { font-size: 10px; color: ' + textSecondary + '; }\
    .sc-topic-desc { font-size: 10px; color: ' + textSecondary + '; }\
    .sc-topic-online { margin-left: auto; font-size: 9px; padding: 2px 8px; border-radius: 6px; background: ' + (isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5') + '; color: #10b981; border: 1px solid ' + (isDark ? 'rgba(16,185,129,0.3)' : 'transparent') + '; }\
    .sc-messages { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; }\
    .sc-messages::-webkit-scrollbar { width: 4px; }\
    .sc-messages::-webkit-scrollbar-thumb { background: ' + borderColor + '; border-radius: 2px; }\
    .sc-msg { display: flex; gap: 10px; align-items: flex-start; }\
    .sc-msg-avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 700; flex-shrink: 0; }\
    .sc-msg-body { flex: 1; min-width: 0; }\
    .sc-msg-header { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }\
    .sc-msg-name { font-weight: 600; font-size: 12px; color: ' + textPrimary + '; }\
    .sc-msg-name.bot { color: #10b981; }\
    .sc-msg-app-badge { font-size: 8px; padding: 1px 5px; border-radius: 4px; font-weight: 600; }\
    .sc-msg-app-badge.team { background: ' + primaryColor + '20; color: ' + primaryColor + '; }\
    .sc-msg-app-badge.cross { background: ' + (isDark ? 'rgba(139,92,246,0.2)' : '#ede9fe') + '; color: ' + (isDark ? '#a78bfa' : '#7c3aed') + '; }\
    .sc-msg-time { font-size: 9px; color: ' + textSecondary + '; }\
    .sc-msg-text { font-size: 12px; color: ' + (isDark ? '#cbd5e1' : '#475569') + '; line-height: 1.5; }\
    .sc-msg-reactions { display: flex; gap: 4px; margin-top: 4px; }\
    .sc-msg-reaction { font-size: 9px; padding: 2px 6px; border-radius: 10px; background: ' + bgTertiary + '; border: 1px solid ' + borderColor + '; cursor: pointer; }\
    .sc-msg-reaction:hover { border-color: ' + primaryColor + '; }\
    .sc-typing { font-size: 11px; color: ' + primaryColor + '; padding: 0 14px 4px; opacity: 0.8; }\
    .sc-input-bar { display: flex; gap: 8px; padding: 10px 14px; border-top: 1px solid ' + borderColor + '; background: ' + bgSecondary + '; }\
    .sc-input { flex: 1; padding: 9px 14px; border-radius: 10px; border: 1px solid ' + borderColor + '; background: ' + bgPrimary + '; color: ' + textPrimary + '; font-size: 12px; outline: none; transition: border-color 0.2s; }\
    .sc-input:focus { border-color: ' + primaryColor + '; }\
    .sc-input::placeholder { color: ' + textSecondary + '; }\
    .sc-send-btn { width: 36px; height: 36px; border-radius: 10px; border: none; background: linear-gradient(135deg, ' + primaryColor + ', #3b82f6); color: white; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.15s, box-shadow 0.2s; }\
    .sc-send-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px ' + primaryColor + '60; }\
    .sc-powered { text-align: center; font-size: 9px; color: ' + textSecondary + '; padding: 5px; }\
    .sc-powered a { color: ' + primaryColor + '; text-decoration: none; font-weight: 500; }\
  ';

  var ECOSYSTEM_CHANNELS = ['# general', '# announcements'];
  var APP_CHANNELS = ['# darkwavestudios-support', '# garagebot-support', '# tlid-marketing'];
  var DM_USERS = [
    { name: 'Alex M.', online: true, tier: 'PRO' },
    { name: 'Sarah K.', online: true, tier: null }
  ];
  var ALL_CHANNELS = ECOSYSTEM_CHANNELS.concat(APP_CHANNELS);

  var activeChannel = 2;
  if (channelName) {
    var lookup = '# ' + channelName;
    var found = ALL_CHANNELS.indexOf(lookup);
    if (found === -1) {
      for (var ci = 0; ci < ALL_CHANNELS.length; ci++) {
        if (ALL_CHANNELS[ci].indexOf(channelName) !== -1) { found = ci; break; }
      }
    }
    if (found !== -1) activeChannel = found;
  }

  var SAMPLE_MESSAGES = [
    { user: 'Sarah K.', avatar: 'SK', color: '#ec4899', text: 'Need help with my booking widget config', time: '2:31 PM', badge: 'GarageBot', badgeType: 'cross', reactions: ['\u{1F44D} 2', '\u{1F527} 1'] },
    { user: '\u{1F916} SignalBot', avatar: '\u{1F916}', color: '#10b981', text: 'Ticket #284 created. @DarkWave team notified.', time: '2:31 PM', isBot: true },
    { user: 'Alex M.', avatar: 'AM', color: '#3b82f6', text: 'Checking your setup now \u2014 same TL account right?', time: '2:33 PM', badge: 'DWS Team', badgeType: 'team' },
    { user: 'Sarah K.', avatar: 'SK', color: '#ec4899', text: 'Yes, same Trust Layer login. Cross-app identity is \u{1F525}', time: '2:34 PM', badge: 'GarageBot', badgeType: 'cross' }
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
    var badgeHtml = '';
    if (msg.badge) {
      badgeHtml = '<span class="sc-msg-app-badge ' + (msg.badgeType || '') + '">' + msg.badge + '</span>';
    }
    return '<div class="sc-msg">' +
      '<div class="sc-msg-avatar" style="background: ' + msg.color + '">' + msg.avatar + '</div>' +
      '<div class="sc-msg-body">' +
        '<div class="sc-msg-header">' +
          '<span class="sc-msg-name' + (msg.isBot ? ' bot' : '') + '">' + msg.user + '</span>' +
          badgeHtml +
          '<span class="sc-msg-time">' + msg.time + '</span>' +
        '</div>' +
        '<div class="sc-msg-text">' + msg.text + '</div>' +
        reactionsHtml +
      '</div>' +
    '</div>';
  }

  function renderChannelSidebar() {
    var html = '';
    html += '<div class="sc-ch-section sc-ch-section-eco">Ecosystem</div>';
    ECOSYSTEM_CHANNELS.forEach(function(ch, i) {
      html += '<div class="sc-ch-item' + (i === activeChannel ? ' active' : '') + '" data-channel="' + i + '">' + ch + '</div>';
    });
    html += '<div class="sc-ch-section sc-ch-section-app">App Support</div>';
    APP_CHANNELS.forEach(function(ch, i) {
      var idx = i + ECOSYSTEM_CHANNELS.length;
      html += '<div class="sc-ch-item' + (idx === activeChannel ? ' active' : '') + '" data-channel="' + idx + '">' + ch + '</div>';
    });
    html += '<div class="sc-ch-section sc-ch-section-dm">DMs</div>';
    DM_USERS.forEach(function(dm) {
      var dotColor = dm.online ? '#10b981' : '#64748b';
      html += '<div class="sc-ch-item"><span class="sc-dm-dot" style="background:' + dotColor + '"></span> ' + dm.name.split(' ')[0];
      if (dm.tier) {
        html += '<span class="sc-ch-badge">' + dm.tier + '</span>';
      }
      html += '</div>';
    });
    return html;
  }

  function render() {
    injectStyles();
    var currentChannel = ALL_CHANNELS[activeChannel] || '# dws-support';

    container.innerHTML = '\
      <div class="sc-container">\
        <div class="sc-header">\
          <div class="sc-header-icon">\u26A1</div>\
          <div class="sc-header-info">\
            <div class="sc-header-name">Trust Layer Ecosystem</div>\
            <div class="sc-header-status"><span class="sc-header-dot"></span> 142 online across 17 apps</div>\
          </div>\
          <div class="sc-header-badges">\
            <span class="sc-badge sc-badge-sso">SSO</span>\
            <span class="sc-badge sc-badge-live">LIVE</span>\
          </div>\
        </div>\
        <div class="sc-sidebar">\
          <div class="sc-channels">' + renderChannelSidebar() + '</div>\
          <div class="sc-main">\
            <div class="sc-topic-bar">\
              <span class="sc-topic-name">' + currentChannel + '</span>\
              <span class="sc-topic-sep">|</span>\
              <span class="sc-topic-desc">' + (currentChannel.indexOf('darkwave') !== -1 ? 'DarkWave Studios' : currentChannel.indexOf('garagebot') !== -1 ? 'GarageBot' : currentChannel.indexOf('tlid') !== -1 ? 'TLId Marketing' : 'Ecosystem') + '</span>\
              <span class="sc-topic-online">3 online</span>\
            </div>\
            <div class="sc-messages">' + SAMPLE_MESSAGES.map(renderMessage).join('') + '</div>\
            <div class="sc-typing">\u270D\uFE0F Sarah is typing...</div>\
            <div class="sc-input-bar">\
              <input class="sc-input" placeholder="Message ' + currentChannel + '..." />\
              <button class="sc-send-btn">\u2191</button>\
            </div>\
          </div>\
        </div>\
        <div class="sc-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a> \u2022 Cross-app SSO identity</div>\
      </div>\
    ';

    var channelItems = container.querySelectorAll('.sc-ch-item[data-channel]');
    channelItems.forEach(function(item) {
      item.addEventListener('click', function() {
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

  window.TLSignalChat = {
    refresh: render,
    setChannel: function(ch) {
      var idx = ALL_CHANNELS.indexOf('# ' + ch);
      if (idx !== -1) { activeChannel = idx; render(); }
    }
  };
  console.log('[Signal Chat] v2.0.0 loaded for site:', siteId, '| channel:', channelName);
})();
