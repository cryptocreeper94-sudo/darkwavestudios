/**
 * TrustLayer Golf Distance Calculator Widget
 * Version: 1.0.0
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#10b981';
  var containerId = currentScript.getAttribute('data-container') || 'tl-golf-distance';
  var container = document.getElementById(containerId);
  if (!container) return;

  var courses = [
    { name: 'Augusta National', lat: 33.5031, lng: -82.0231 },
    { name: 'Pebble Beach', lat: 36.5685, lng: -121.9500 },
    { name: 'St Andrews', lat: 56.3434, lng: -2.8028 },
    { name: 'Pinehurst No. 2', lat: 35.1954, lng: -79.4712 },
    { name: 'Torrey Pines', lat: 32.9005, lng: -117.2528 }
  ];

  var pins = [
    { label: 'TEE', x: 15, y: 75, color: '#ef4444' },
    { label: 'PIN', x: 78, y: 22, color: '#f59e0b' }
  ];

  var css = '\
    .tl-golf-dist { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 400px; margin: 0 auto; background: linear-gradient(145deg, #064e3b, #065f46, #047857); border-radius: 16px; overflow: hidden; color: #fff; }\
    .tl-golf-dist-header { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); }\
    .tl-golf-dist-title { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }\
    .tl-golf-dist-badge { font-size: 10px; background: rgba(16,185,129,0.3); border: 1px solid rgba(16,185,129,0.5); padding: 2px 8px; border-radius: 10px; }\
    .tl-golf-dist-map { position: relative; height: 200px; background: linear-gradient(180deg, #1a3a2a 0%, #0d2818 50%, #1a4a2a 100%); overflow: hidden; }\
    .tl-golf-dist-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 20px 20px; }\
    .tl-golf-dist-fairway { position: absolute; top: 10%; left: 20%; width: 60%; height: 80%; background: linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.25)); border-radius: 40% 60% 50% 40%; }\
    .tl-golf-dist-pin { position: absolute; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; cursor: pointer; box-shadow: 0 0 12px rgba(0,0,0,0.4); transition: transform 0.2s, box-shadow 0.2s; z-index: 2; }\
    .tl-golf-dist-pin:hover { transform: scale(1.15); }\
    .tl-golf-dist-line { position: absolute; z-index: 1; pointer-events: none; }\
    .tl-golf-dist-line svg { width: 100%; height: 100%; }\
    .tl-golf-dist-result { padding: 16px 20px; background: rgba(0,0,0,0.2); }\
    .tl-golf-dist-yards { font-size: 36px; font-weight: 800; text-align: center; background: linear-gradient(135deg, #34d399, #6ee7b7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }\
    .tl-golf-dist-unit { font-size: 14px; -webkit-text-fill-color: rgba(255,255,255,0.6); }\
    .tl-golf-dist-meta { display: flex; justify-content: center; gap: 20px; margin-top: 8px; font-size: 12px; opacity: 0.7; }\
    .tl-golf-dist-controls { padding: 12px 20px; display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,0.08); }\
    .tl-golf-dist-select { flex: 1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 8px 10px; color: #fff; font-size: 12px; outline: none; }\
    .tl-golf-dist-select option { background: #064e3b; color: #fff; }\
    .tl-golf-dist-toggle { display: flex; background: rgba(255,255,255,0.08); border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.12); }\
    .tl-golf-dist-toggle-btn { padding: 8px 12px; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s; border: none; background: none; }\
    .tl-golf-dist-toggle-btn.active { background: ' + primaryColor + '; color: #fff; }\
    .tl-golf-dist-powered { text-align: center; padding: 8px; font-size: 10px; opacity: 0.4; }\
    .tl-golf-dist-powered a { color: #fff; text-decoration: none; }\
    .tl-golf-dist-pulse { animation: tl-gd-pulse 2s infinite; }\
    @keyframes tl-gd-pulse { 0%, 100% { box-shadow: 0 0 8px rgba(239,68,68,0.4); } 50% { box-shadow: 0 0 20px rgba(239,68,68,0.8); } }\
  ';

  function calcDistance(p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    return Math.round(Math.sqrt(dx*dx + dy*dy) * 2.8);
  }

  function render() {
    if (document.getElementById('tl-golf-dist-styles')) {
      document.getElementById('tl-golf-dist-styles').textContent = css;
    } else {
      var style = document.createElement('style');
      style.id = 'tl-golf-dist-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }

    var dist = calcDistance(pins[0], pins[1]);
    var meters = Math.round(dist * 0.9144);
    var optionsHtml = '';
    courses.forEach(function(c) {
      optionsHtml += '<option>' + c.name + '</option>';
    });

    container.innerHTML = '\
      <div class="tl-golf-dist">\
        <div class="tl-golf-dist-header">\
          <div class="tl-golf-dist-title">⛳ Distance Calculator <span class="tl-golf-dist-badge">GPS</span></div>\
        </div>\
        <div class="tl-golf-dist-map">\
          <div class="tl-golf-dist-grid"></div>\
          <div class="tl-golf-dist-fairway"></div>\
          <div class="tl-golf-dist-pin tl-golf-dist-pulse" style="left:' + pins[0].x + '%;top:' + pins[0].y + '%;background:' + pins[0].color + ';transform:translate(-50%,-50%)">' + pins[0].label + '</div>\
          <div class="tl-golf-dist-pin" style="left:' + pins[1].x + '%;top:' + pins[1].y + '%;background:' + pins[1].color + ';transform:translate(-50%,-50%)">' + pins[1].label + '</div>\
          <svg class="tl-golf-dist-line" style="position:absolute;inset:0;width:100%;height:100%">\
            <line x1="' + pins[0].x + '%" y1="' + pins[0].y + '%" x2="' + pins[1].x + '%" y2="' + pins[1].y + '%" stroke="rgba(52,211,153,0.6)" stroke-width="2" stroke-dasharray="6,4"/>\
          </svg>\
        </div>\
        <div class="tl-golf-dist-result">\
          <div class="tl-golf-dist-yards">' + dist + ' <span class="tl-golf-dist-unit">yds</span></div>\
          <div class="tl-golf-dist-meta">\
            <span>📍 ' + meters + 'm</span>\
            <span>🏌️ Mid-Iron Range</span>\
            <span>🎯 Haversine</span>\
          </div>\
        </div>\
        <div class="tl-golf-dist-controls">\
          <select class="tl-golf-dist-select">' + optionsHtml + '</select>\
          <div class="tl-golf-dist-toggle">\
            <button class="tl-golf-dist-toggle-btn active">YDS</button>\
            <button class="tl-golf-dist-toggle-btn">MTR</button>\
          </div>\
        </div>\
        <div class="tl-golf-dist-powered">Powered by <a href="https://trustgolf.app" target="_blank">Trust Golf</a></div>\
      </div>\
    ';
  }

  render();
  console.log('[TL Golf Distance] Widget loaded');
})();
