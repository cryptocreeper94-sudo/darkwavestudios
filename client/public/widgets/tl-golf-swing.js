/**
 * TrustLayer AI Swing Analyzer Widget
 * Version: 1.0.0
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#ec4899';
  var containerId = currentScript.getAttribute('data-container') || 'tl-golf-swing';
  var container = document.getElementById(containerId);
  if (!container) return;

  var analysis = {
    club: 'Driver',
    score: 82,
    tips: [
      { category: 'Grip', rating: 'Good', detail: 'Neutral grip with proper V-formation', icon: '✋' },
      { category: 'Backswing', rating: 'Needs Work', detail: 'Over-rotation at the top — try stopping at parallel', icon: '🔄' },
      { category: 'Impact', rating: 'Excellent', detail: 'Square clubface at impact with forward shaft lean', icon: '💥' },
      { category: 'Follow-through', rating: 'Good', detail: 'Full extension — maintain balance on finish', icon: '🏌️' }
    ]
  };

  var clubs = ['Driver', '3-Wood', '5-Iron', '7-Iron', '9-Iron', 'PW', 'SW', 'Putter'];

  var css = '\
    .tl-swing { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 400px; margin: 0 auto; background: linear-gradient(145deg, #500724, #831843, #9d174d); border-radius: 16px; overflow: hidden; color: #fff; }\
    .tl-swing-header { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); }\
    .tl-swing-title { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }\
    .tl-swing-ai { font-size: 9px; background: rgba(236,72,153,0.3); border: 1px solid rgba(236,72,153,0.5); padding: 2px 8px; border-radius: 10px; font-weight: 600; }\
    .tl-swing-preview { position: relative; height: 160px; background: linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1)); display: flex; align-items: center; justify-content: center; overflow: hidden; }\
    .tl-swing-silhouette { font-size: 80px; filter: drop-shadow(0 0 20px rgba(236,72,153,0.4)); }\
    .tl-swing-playback { position: absolute; bottom: 12px; display: flex; gap: 8px; }\
    .tl-swing-speed { font-size: 10px; padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); cursor: pointer; color: #fff; transition: all 0.2s; }\
    .tl-swing-speed.active { background: ' + primaryColor + '; border-color: ' + primaryColor + '; }\
    .tl-swing-score-section { padding: 16px 20px; display: flex; align-items: center; gap: 16px; background: rgba(0,0,0,0.15); }\
    .tl-swing-score-circle { width: 64px; height: 64px; border-radius: 50%; border: 3px solid ' + primaryColor + '; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }\
    .tl-swing-score-num { font-size: 24px; font-weight: 800; }\
    .tl-swing-score-info { flex: 1; }\
    .tl-swing-score-label { font-size: 11px; opacity: 0.6; }\
    .tl-swing-score-club { font-size: 16px; font-weight: 700; }\
    .tl-swing-clubs { display: flex; gap: 4px; margin-top: 6px; flex-wrap: wrap; }\
    .tl-swing-club-tag { font-size: 9px; padding: 2px 8px; background: rgba(255,255,255,0.08); border-radius: 6px; cursor: pointer; transition: background 0.2s; }\
    .tl-swing-club-tag.active { background: rgba(236,72,153,0.3); }\
    .tl-swing-tips { padding: 12px 20px 16px; }\
    .tl-swing-tip { display: flex; align-items: flex-start; gap: 12px; padding: 10px 12px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-bottom: 6px; transition: background 0.2s; }\
    .tl-swing-tip:hover { background: rgba(255,255,255,0.1); }\
    .tl-swing-tip-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }\
    .tl-swing-tip-content { flex: 1; }\
    .tl-swing-tip-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }\
    .tl-swing-tip-cat { font-size: 13px; font-weight: 600; }\
    .tl-swing-tip-rating { font-size: 10px; padding: 2px 8px; border-radius: 6px; font-weight: 600; }\
    .tl-swing-rating-good { background: rgba(52,211,153,0.2); color: #34d399; }\
    .tl-swing-rating-excellent { background: rgba(96,165,250,0.2); color: #60a5fa; }\
    .tl-swing-rating-needs { background: rgba(251,191,36,0.2); color: #fbbf24; }\
    .tl-swing-tip-detail { font-size: 11px; opacity: 0.7; line-height: 1.4; }\
    .tl-swing-powered { text-align: center; padding: 8px; font-size: 10px; opacity: 0.4; }\
    .tl-swing-powered a { color: #fff; text-decoration: none; }\
  ';

  function render() {
    if (!document.getElementById('tl-swing-styles')) {
      var style = document.createElement('style');
      style.id = 'tl-swing-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }

    var tipsHtml = analysis.tips.map(function(t) {
      var ratingCls = t.rating === 'Excellent' ? 'excellent' : t.rating === 'Good' ? 'good' : 'needs';
      return '\
        <div class="tl-swing-tip">\
          <div class="tl-swing-tip-icon">' + t.icon + '</div>\
          <div class="tl-swing-tip-content">\
            <div class="tl-swing-tip-header">\
              <span class="tl-swing-tip-cat">' + t.category + '</span>\
              <span class="tl-swing-tip-rating tl-swing-rating-' + ratingCls + '">' + t.rating + '</span>\
            </div>\
            <div class="tl-swing-tip-detail">' + t.detail + '</div>\
          </div>\
        </div>';
    }).join('');

    var clubsHtml = clubs.map(function(c) {
      var active = c === analysis.club ? ' active' : '';
      return '<span class="tl-swing-club-tag' + active + '">' + c + '</span>';
    }).join('');

    container.innerHTML = '\
      <div class="tl-swing">\
        <div class="tl-swing-header">\
          <div class="tl-swing-title">🎯 Swing Analyzer</div>\
          <span class="tl-swing-ai">GPT-4o</span>\
        </div>\
        <div class="tl-swing-preview">\
          <div class="tl-swing-silhouette">🏌️</div>\
          <div class="tl-swing-playback">\
            <button class="tl-swing-speed">0.25x</button>\
            <button class="tl-swing-speed active">0.5x</button>\
            <button class="tl-swing-speed">1x</button>\
          </div>\
        </div>\
        <div class="tl-swing-score-section">\
          <div class="tl-swing-score-circle"><span class="tl-swing-score-num">' + analysis.score + '</span></div>\
          <div class="tl-swing-score-info">\
            <div class="tl-swing-score-label">Analysis Score</div>\
            <div class="tl-swing-score-club">' + analysis.club + ' Analysis</div>\
            <div class="tl-swing-clubs">' + clubsHtml + '</div>\
          </div>\
        </div>\
        <div class="tl-swing-tips">' + tipsHtml + '</div>\
        <div class="tl-swing-powered">Powered by <a href="https://trustgolf.app" target="_blank">Trust Golf</a></div>\
      </div>\
    ';
  }

  render();
  console.log('[TL Golf Swing] Widget loaded');
})();
