/**
 * TrustLayer Golf Course Embed Card Widget
 * Version: 1.0.0
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#6366f1';
  var containerId = currentScript.getAttribute('data-container') || 'tl-golf-course-card';
  var container = document.getElementById(containerId);
  if (!container) return;

  var course = {
    name: 'Augusta National Golf Club',
    location: 'Augusta, Georgia',
    designer: 'Alister MacKenzie & Bobby Jones',
    year: 1933,
    par: 72,
    yardage: '7,475',
    rating: 76.2,
    slope: 148,
    greenFee: 'Private / Invite Only',
    amenities: ['🏌️ 18 Holes', '🌳 Championship', '📺 Home of The Masters', '🏆 Major Venue', '🌺 Iconic Landscaping', '⛳ Par 3 Course']
  };

  var css = '\
    .tl-gcc { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 400px; margin: 0 auto; background: linear-gradient(145deg, #1e1b4b, #312e81, #3730a3); border-radius: 16px; overflow: hidden; color: #fff; }\
    .tl-gcc-hero { position: relative; height: 140px; background: linear-gradient(135deg, #065f46 0%, #047857 30%, #059669 60%, #10b981 100%); overflow: hidden; }\
    .tl-gcc-hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(30,27,75,0.9) 100%); }\
    .tl-gcc-hero-pattern { position: absolute; inset: 0; opacity: 0.1; background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.3) 1px, transparent 1px); background-size: 30px 30px; }\
    .tl-gcc-flag { position: absolute; right: 24px; top: 20px; font-size: 40px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); }\
    .tl-gcc-private { position: absolute; top: 12px; left: 12px; font-size: 9px; background: rgba(245,158,11,0.3); border: 1px solid rgba(245,158,11,0.5); padding: 3px 10px; border-radius: 10px; font-weight: 600; letter-spacing: 0.5px; }\
    .tl-gcc-body { padding: 20px; }\
    .tl-gcc-name { font-size: 20px; font-weight: 800; margin-bottom: 4px; }\
    .tl-gcc-loc { font-size: 13px; opacity: 0.6; margin-bottom: 16px; display: flex; align-items: center; gap: 4px; }\
    .tl-gcc-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }\
    .tl-gcc-stat { text-align: center; padding: 10px 4px; background: rgba(255,255,255,0.06); border-radius: 10px; }\
    .tl-gcc-stat-val { font-size: 18px; font-weight: 700; background: linear-gradient(135deg, #818cf8, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }\
    .tl-gcc-stat-lbl { font-size: 9px; opacity: 0.5; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }\
    .tl-gcc-info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; font-size: 12px; }\
    .tl-gcc-info-item { padding: 8px 12px; background: rgba(255,255,255,0.05); border-radius: 8px; }\
    .tl-gcc-info-label { opacity: 0.5; font-size: 10px; }\
    .tl-gcc-info-value { font-weight: 600; margin-top: 2px; }\
    .tl-gcc-amenities { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }\
    .tl-gcc-amenity { font-size: 11px; padding: 4px 10px; background: rgba(255,255,255,0.06); border-radius: 8px; white-space: nowrap; }\
    .tl-gcc-cta { display: block; width: 100%; padding: 12px; background: linear-gradient(135deg, ' + primaryColor + ', #818cf8); border: none; border-radius: 10px; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; text-align: center; transition: opacity 0.2s; }\
    .tl-gcc-cta:hover { opacity: 0.9; }\
    .tl-gcc-powered { text-align: center; padding: 10px; font-size: 10px; opacity: 0.4; }\
    .tl-gcc-powered a { color: #fff; text-decoration: none; }\
  ';

  function render() {
    if (!document.getElementById('tl-gcc-styles')) {
      var style = document.createElement('style');
      style.id = 'tl-gcc-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }

    var amenitiesHtml = course.amenities.map(function(a) {
      return '<span class="tl-gcc-amenity">' + a + '</span>';
    }).join('');

    container.innerHTML = '\
      <div class="tl-gcc">\
        <div class="tl-gcc-hero">\
          <div class="tl-gcc-hero-pattern"></div>\
          <div class="tl-gcc-hero-overlay"></div>\
          <div class="tl-gcc-flag">⛳</div>\
          <span class="tl-gcc-private">PRIVATE</span>\
        </div>\
        <div class="tl-gcc-body">\
          <div class="tl-gcc-name">' + course.name + '</div>\
          <div class="tl-gcc-loc">📍 ' + course.location + '</div>\
          <div class="tl-gcc-stats">\
            <div class="tl-gcc-stat"><div class="tl-gcc-stat-val">' + course.par + '</div><div class="tl-gcc-stat-lbl">Par</div></div>\
            <div class="tl-gcc-stat"><div class="tl-gcc-stat-val">' + course.yardage + '</div><div class="tl-gcc-stat-lbl">Yards</div></div>\
            <div class="tl-gcc-stat"><div class="tl-gcc-stat-val">' + course.rating + '</div><div class="tl-gcc-stat-lbl">Rating</div></div>\
            <div class="tl-gcc-stat"><div class="tl-gcc-stat-val">' + course.slope + '</div><div class="tl-gcc-stat-lbl">Slope</div></div>\
          </div>\
          <div class="tl-gcc-info">\
            <div class="tl-gcc-info-item"><div class="tl-gcc-info-label">Designer</div><div class="tl-gcc-info-value">' + course.designer + '</div></div>\
            <div class="tl-gcc-info-item"><div class="tl-gcc-info-label">Est.</div><div class="tl-gcc-info-value">' + course.year + '</div></div>\
          </div>\
          <div class="tl-gcc-amenities">' + amenitiesHtml + '</div>\
          <button class="tl-gcc-cta">View Course Details →</button>\
        </div>\
        <div class="tl-gcc-powered">Powered by <a href="https://trustgolf.app" target="_blank">Trust Golf</a></div>\
      </div>\
    ';
  }

  render();
  console.log('[TL Golf Course Card] Widget loaded');
})();
