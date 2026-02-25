/**
 * TrustLayer USGA Handicap Calculator Widget
 * Version: 1.0.0
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#f59e0b';
  var containerId = currentScript.getAttribute('data-container') || 'tl-golf-handicap';
  var container = document.getElementById(containerId);
  if (!container) return;

  var rounds = [
    { date: 'Feb 20', course: 'Augusta National', score: 82, rating: 72.1, slope: 137 },
    { date: 'Feb 15', course: 'Pebble Beach', score: 78, rating: 71.8, slope: 142 },
    { date: 'Feb 10', course: 'Pinehurst No. 2', score: 85, rating: 73.2, slope: 135 },
    { date: 'Feb 05', course: 'Torrey Pines', score: 80, rating: 72.6, slope: 139 },
    { date: 'Jan 30', course: 'St Andrews', score: 76, rating: 70.4, slope: 131 }
  ];

  function calcDiff(score, rating, slope) {
    return ((score - rating) * 113 / slope).toFixed(1);
  }

  var diffs = rounds.map(function(r) { return parseFloat(calcDiff(r.score, r.rating, r.slope)); });
  var sorted = diffs.slice().sort(function(a, b) { return a - b; });
  var best = sorted.slice(0, 3);
  var handicap = (best.reduce(function(a, b) { return a + b; }, 0) / best.length * 0.96).toFixed(1);

  var css = '\
    .tl-hcap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 400px; margin: 0 auto; background: linear-gradient(145deg, #451a03, #78350f, #92400e); border-radius: 16px; overflow: hidden; color: #fff; }\
    .tl-hcap-header { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); }\
    .tl-hcap-title { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }\
    .tl-hcap-usga { font-size: 9px; background: rgba(245,158,11,0.3); border: 1px solid rgba(245,158,11,0.5); padding: 2px 8px; border-radius: 10px; font-weight: 600; letter-spacing: 0.5px; }\
    .tl-hcap-index { padding: 24px 20px; text-align: center; background: rgba(0,0,0,0.15); }\
    .tl-hcap-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.6; margin-bottom: 8px; }\
    .tl-hcap-value { font-size: 56px; font-weight: 800; background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; }\
    .tl-hcap-trend { display: inline-flex; align-items: center; gap: 4px; margin-top: 8px; font-size: 12px; color: #34d399; background: rgba(52,211,153,0.15); padding: 4px 10px; border-radius: 12px; }\
    .tl-hcap-rounds { padding: 12px 20px; }\
    .tl-hcap-rounds-title { font-size: 12px; font-weight: 600; opacity: 0.7; margin-bottom: 10px; }\
    .tl-hcap-round { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-bottom: 6px; font-size: 12px; transition: background 0.2s; }\
    .tl-hcap-round:hover { background: rgba(255,255,255,0.1); }\
    .tl-hcap-round-course { font-weight: 600; flex: 1; }\
    .tl-hcap-round-date { opacity: 0.5; width: 55px; }\
    .tl-hcap-round-score { font-weight: 700; width: 30px; text-align: center; }\
    .tl-hcap-round-diff { width: 45px; text-align: right; padding: 2px 8px; border-radius: 6px; font-weight: 600; font-size: 11px; }\
    .tl-hcap-diff-good { background: rgba(52,211,153,0.2); color: #34d399; }\
    .tl-hcap-diff-avg { background: rgba(245,158,11,0.2); color: #fbbf24; }\
    .tl-hcap-diff-high { background: rgba(239,68,68,0.2); color: #f87171; }\
    .tl-hcap-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 0 20px 16px; }\
    .tl-hcap-stat { text-align: center; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; }\
    .tl-hcap-stat-val { font-size: 16px; font-weight: 700; }\
    .tl-hcap-stat-lbl { font-size: 10px; opacity: 0.5; margin-top: 2px; }\
    .tl-hcap-powered { text-align: center; padding: 8px; font-size: 10px; opacity: 0.4; }\
    .tl-hcap-powered a { color: #fff; text-decoration: none; }\
  ';

  function render() {
    if (!document.getElementById('tl-hcap-styles')) {
      var style = document.createElement('style');
      style.id = 'tl-hcap-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }

    var roundsHtml = '';
    rounds.forEach(function(r, i) {
      var diff = diffs[i];
      var cls = diff < 8 ? 'good' : diff < 12 ? 'avg' : 'high';
      roundsHtml += '\
        <div class="tl-hcap-round">\
          <div class="tl-hcap-round-date">' + r.date + '</div>\
          <div class="tl-hcap-round-course">' + r.course + '</div>\
          <div class="tl-hcap-round-score">' + r.score + '</div>\
          <div class="tl-hcap-round-diff tl-hcap-diff-' + cls + '">' + diff.toFixed(1) + '</div>\
        </div>';
    });

    var avg = Math.round(rounds.reduce(function(a, r) { return a + r.score; }, 0) / rounds.length);
    var best_score = Math.min.apply(null, rounds.map(function(r) { return r.score; }));

    container.innerHTML = '\
      <div class="tl-hcap">\
        <div class="tl-hcap-header">\
          <div class="tl-hcap-title">🏆 Handicap Index</div>\
          <span class="tl-hcap-usga">USGA</span>\
        </div>\
        <div class="tl-hcap-index">\
          <div class="tl-hcap-label">Handicap Index</div>\
          <div class="tl-hcap-value">' + handicap + '</div>\
          <div class="tl-hcap-trend">↓ 0.3 improvement</div>\
        </div>\
        <div class="tl-hcap-rounds">\
          <div class="tl-hcap-rounds-title">Recent Rounds</div>\
          ' + roundsHtml + '\
        </div>\
        <div class="tl-hcap-stats">\
          <div class="tl-hcap-stat"><div class="tl-hcap-stat-val">' + rounds.length + '</div><div class="tl-hcap-stat-lbl">Rounds</div></div>\
          <div class="tl-hcap-stat"><div class="tl-hcap-stat-val">' + avg + '</div><div class="tl-hcap-stat-lbl">Avg Score</div></div>\
          <div class="tl-hcap-stat"><div class="tl-hcap-stat-val">' + best_score + '</div><div class="tl-hcap-stat-lbl">Best</div></div>\
        </div>\
        <div class="tl-hcap-powered">Powered by <a href="https://trustgolf.app" target="_blank">Trust Golf</a></div>\
      </div>\
    ';
  }

  render();
  console.log('[TL Golf Handicap] Widget loaded');
})();
