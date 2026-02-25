/**
 * TrustLayer Golf Blog Content API Widget
 * Version: 1.0.0
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#14b8a6';
  var containerId = currentScript.getAttribute('data-container') || 'tl-golf-blog';
  var container = document.getElementById(containerId);
  if (!container) return;

  var posts = [
    { title: '5 Drills to Fix Your Slice Forever', category: 'Instruction', status: 'Published', views: '2.4K', readTime: '6 min', seo: 94 },
    { title: 'Best Putters Under $200 in 2026', category: 'Equipment', status: 'Published', views: '1.8K', readTime: '8 min', seo: 91 },
    { title: 'Hidden Gems: 10 Underrated Public Courses', category: 'Courses', status: 'Draft', views: '—', readTime: '12 min', seo: 88 }
  ];

  var categories = [
    { name: 'Instruction', count: 24, icon: '📚', color: '#3b82f6' },
    { name: 'Equipment', count: 18, icon: '🏌️', color: '#f59e0b' },
    { name: 'Courses', count: 15, icon: '⛳', color: '#10b981' },
    { name: 'Fitness', count: 9, icon: '💪', color: '#ef4444' },
    { name: 'Mental Game', count: 7, icon: '🧠', color: '#8b5cf6' },
    { name: 'News', count: 12, icon: '📰', color: '#6366f1' }
  ];

  var css = '\
    .tl-gblog { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 400px; margin: 0 auto; background: linear-gradient(145deg, #042f2e, #0f766e, #115e59); border-radius: 16px; overflow: hidden; color: #fff; }\
    .tl-gblog-header { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); }\
    .tl-gblog-title { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }\
    .tl-gblog-ai { font-size: 9px; background: rgba(20,184,166,0.3); border: 1px solid rgba(20,184,166,0.5); padding: 2px 8px; border-radius: 10px; font-weight: 600; }\
    .tl-gblog-cats { padding: 12px 20px; display: flex; gap: 6px; flex-wrap: wrap; }\
    .tl-gblog-cat { display: flex; align-items: center; gap: 4px; font-size: 11px; padding: 4px 10px; background: rgba(255,255,255,0.06); border-radius: 8px; cursor: pointer; transition: background 0.2s; }\
    .tl-gblog-cat:hover { background: rgba(255,255,255,0.12); }\
    .tl-gblog-cat-count { opacity: 0.5; font-size: 10px; }\
    .tl-gblog-posts { padding: 0 20px 12px; }\
    .tl-gblog-post { padding: 12px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-bottom: 8px; transition: background 0.2s; cursor: pointer; }\
    .tl-gblog-post:hover { background: rgba(255,255,255,0.1); }\
    .tl-gblog-post-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }\
    .tl-gblog-post-title { font-size: 13px; font-weight: 600; flex: 1; line-height: 1.3; }\
    .tl-gblog-post-status { font-size: 9px; padding: 2px 8px; border-radius: 6px; font-weight: 600; flex-shrink: 0; margin-left: 8px; }\
    .tl-gblog-status-pub { background: rgba(52,211,153,0.2); color: #34d399; }\
    .tl-gblog-status-draft { background: rgba(251,191,36,0.2); color: #fbbf24; }\
    .tl-gblog-post-meta { display: flex; gap: 12px; font-size: 11px; opacity: 0.6; }\
    .tl-gblog-post-seo { display: flex; align-items: center; gap: 4px; }\
    .tl-gblog-seo-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; }\
    .tl-gblog-gen { padding: 0 20px 16px; }\
    .tl-gblog-gen-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; background: linear-gradient(135deg, ' + primaryColor + ', #0d9488); border: none; border-radius: 10px; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; }\
    .tl-gblog-gen-btn:hover { opacity: 0.9; }\
    .tl-gblog-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 0 20px 16px; }\
    .tl-gblog-stat { text-align: center; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; }\
    .tl-gblog-stat-val { font-size: 16px; font-weight: 700; }\
    .tl-gblog-stat-lbl { font-size: 10px; opacity: 0.5; margin-top: 2px; }\
    .tl-gblog-powered { text-align: center; padding: 8px; font-size: 10px; opacity: 0.4; }\
    .tl-gblog-powered a { color: #fff; text-decoration: none; }\
  ';

  function render() {
    if (!document.getElementById('tl-gblog-styles')) {
      var style = document.createElement('style');
      style.id = 'tl-gblog-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }

    var catsHtml = categories.map(function(c) {
      return '<span class="tl-gblog-cat">' + c.icon + ' ' + c.name + ' <span class="tl-gblog-cat-count">' + c.count + '</span></span>';
    }).join('');

    var postsHtml = posts.map(function(p) {
      var statusCls = p.status === 'Published' ? 'pub' : 'draft';
      return '\
        <div class="tl-gblog-post">\
          <div class="tl-gblog-post-top">\
            <div class="tl-gblog-post-title">' + p.title + '</div>\
            <span class="tl-gblog-post-status tl-gblog-status-' + statusCls + '">' + p.status + '</span>\
          </div>\
          <div class="tl-gblog-post-meta">\
            <span>' + p.category + '</span>\
            <span>' + p.readTime + '</span>\
            <span>👁 ' + p.views + '</span>\
            <span class="tl-gblog-post-seo"><span class="tl-gblog-seo-dot"></span> SEO ' + p.seo + '</span>\
          </div>\
        </div>';
    }).join('');

    var total = categories.reduce(function(a, c) { return a + c.count; }, 0);

    container.innerHTML = '\
      <div class="tl-gblog">\
        <div class="tl-gblog-header">\
          <div class="tl-gblog-title">📝 Blog Generator</div>\
          <span class="tl-gblog-ai">AI Content</span>\
        </div>\
        <div class="tl-gblog-cats">' + catsHtml + '</div>\
        <div class="tl-gblog-posts">' + postsHtml + '</div>\
        <div class="tl-gblog-gen">\
          <button class="tl-gblog-gen-btn">✨ Generate New Article</button>\
        </div>\
        <div class="tl-gblog-stats">\
          <div class="tl-gblog-stat"><div class="tl-gblog-stat-val">' + total + '</div><div class="tl-gblog-stat-lbl">Articles</div></div>\
          <div class="tl-gblog-stat"><div class="tl-gblog-stat-val">6</div><div class="tl-gblog-stat-lbl">Categories</div></div>\
          <div class="tl-gblog-stat"><div class="tl-gblog-stat-val">92</div><div class="tl-gblog-stat-lbl">Avg SEO</div></div>\
        </div>\
        <div class="tl-gblog-powered">Powered by <a href="https://trustgolf.app" target="_blank">Trust Golf</a></div>\
      </div>\
    ';
  }

  render();
  console.log('[TL Golf Blog] Widget loaded');
})();
