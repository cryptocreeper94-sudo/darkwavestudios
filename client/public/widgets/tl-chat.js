/**
 * TrustLayer Live Chat Widget
 * Version: 1.0.0
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var position = currentScript.getAttribute('data-position') || 'bottom-right';
  var greeting = currentScript.getAttribute('data-greeting') || 'Hi! How can we help you today?';
  var agentName = currentScript.getAttribute('data-agent-name') || 'Support';
  var webhookUrl = currentScript.getAttribute('data-webhook-url');
  var isOpen = false;
  var messages = [];
  var visitorId = localStorage.getItem('tl_visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('tl_visitor_id', visitorId);
  }
  var css = '\
    .tl-chat-widget { position: fixed; z-index: 99999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }\
    .tl-chat-widget.bottom-right { bottom: 20px; right: 20px; }\
    .tl-chat-widget.bottom-left { bottom: 20px; left: 20px; }\
    .tl-chat-bubble { width: 60px; height: 60px; border-radius: 50%; background: ' + primaryColor + '; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s; }\
    .tl-chat-bubble:hover { transform: scale(1.05); }\
    .tl-chat-bubble svg { width: 28px; height: 28px; }\
    .tl-chat-window { position: absolute; bottom: 80px; right: 0; width: 360px; height: 500px; background: #fff; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.2); display: none; flex-direction: column; overflow: hidden; }\
    .tl-chat-window.open { display: flex; }\
    .tl-chat-widget.bottom-left .tl-chat-window { right: auto; left: 0; }\
    .tl-chat-header { background: ' + primaryColor + '; color: #fff; padding: 16px; display: flex; align-items: center; gap: 12px; }\
    .tl-chat-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-weight: 600; }\
    .tl-chat-agent { font-weight: 600; }\
    .tl-chat-status { font-size: 12px; opacity: 0.9; }\
    .tl-chat-close { margin-left: auto; background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; opacity: 0.8; }\
    .tl-chat-close:hover { opacity: 1; }\
    .tl-chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }\
    .tl-chat-message { max-width: 80%; padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.4; }\
    .tl-chat-message.agent { background: #f3f4f6; color: #1f2937; align-self: flex-start; border-bottom-left-radius: 4px; }\
    .tl-chat-message.visitor { background: ' + primaryColor + '; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }\
    .tl-chat-input-area { padding: 12px; border-top: 1px solid #e5e7eb; display: flex; gap: 8px; }\
    .tl-chat-input { flex: 1; padding: 10px 14px; border: 2px solid #e5e7eb; border-radius: 24px; font-size: 14px; outline: none; }\
    .tl-chat-input:focus { border-color: ' + primaryColor + '; }\
    .tl-chat-send { width: 40px; height: 40px; border-radius: 50%; background: ' + primaryColor + '; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }\
    .tl-chat-send:hover { opacity: 0.9; }\
    .tl-chat-powered { text-align: center; font-size: 11px; color: #9ca3af; padding: 8px; }\
    .tl-chat-powered a { color: ' + primaryColor + '; text-decoration: none; }\
  ';
  function injectStyles() {
    if (document.getElementById('tl-chat-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-chat-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }
  function sendWebhook(data) {
    if (!webhookUrl) return;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', webhookUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      event: 'chat.message',
      siteId: siteId,
      visitorId: visitorId,
      timestamp: new Date().toISOString(),
      data: data
    }));
  }
  function addMessage(text, sender) {
    messages.push({ text: text, sender: sender, time: new Date() });
    renderMessages();
    sendWebhook({ text: text, sender: sender });
  }
  function renderMessages() {
    var container = document.getElementById('tl-chat-messages');
    container.innerHTML = messages.map(function(m) {
      return '<div class="tl-chat-message ' + m.sender + '">' + m.text + '</div>';
    }).join('');
    container.scrollTop = container.scrollHeight;
  }
  function render() {
    injectStyles();
    var widget = document.createElement('div');
    widget.className = 'tl-chat-widget ' + position;
    widget.innerHTML = '\
      <div class="tl-chat-window" id="tl-chat-window">\
        <div class="tl-chat-header">\
          <div class="tl-chat-avatar">' + agentName[0] + '</div>\
          <div><div class="tl-chat-agent">' + agentName + '</div><div class="tl-chat-status">Online</div></div>\
          <button class="tl-chat-close" id="tl-chat-close">&times;</button>\
        </div>\
        <div class="tl-chat-messages" id="tl-chat-messages"></div>\
        <div class="tl-chat-input-area">\
          <input type="text" class="tl-chat-input" id="tl-chat-input" placeholder="Type a message...">\
          <button class="tl-chat-send" id="tl-chat-send">\
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>\
          </button>\
        </div>\
        <div class="tl-chat-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
      <div class="tl-chat-bubble" id="tl-chat-bubble">\
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>\
      </div>\
    ';
    document.body.appendChild(widget);
    messages.push({ text: greeting, sender: 'agent', time: new Date() });
    renderMessages();
    document.getElementById('tl-chat-bubble').addEventListener('click', function() {
      isOpen = !isOpen;
      document.getElementById('tl-chat-window').classList.toggle('open', isOpen);
    });
    document.getElementById('tl-chat-close').addEventListener('click', function() {
      isOpen = false;
      document.getElementById('tl-chat-window').classList.remove('open');
    });
    function sendMessage() {
      var input = document.getElementById('tl-chat-input');
      var text = input.value.trim();
      if (!text) return;
      addMessage(text, 'visitor');
      input.value = '';
      if (window.TLAnalytics) {
        window.TLAnalytics.track('chat_message', { visitorId: visitorId });
      }
      setTimeout(function() {
        addMessage('Thanks for your message! Our team will respond shortly.', 'agent');
      }, 1000);
    }
    document.getElementById('tl-chat-send').addEventListener('click', sendMessage);
    document.getElementById('tl-chat-input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendMessage();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
  window.TLChat = {
    open: function() {
      isOpen = true;
      document.getElementById('tl-chat-window').classList.add('open');
    },
    close: function() {
      isOpen = false;
      document.getElementById('tl-chat-window').classList.remove('open');
    },
    sendMessage: addMessage
  };
  console.log('[TL Chat] Loaded for site:', siteId);
})();
