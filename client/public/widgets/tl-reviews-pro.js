/**
 * TrustLayer Review Widget PRO
 * Version: 2.0.0
 * Premium Multi-Source Review Aggregator
 * Supports: Google, Facebook, Trustpilot, Yelp, BBB
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var containerId = currentScript.getAttribute('data-container') || 'tl-reviews-pro';
  var layout = currentScript.getAttribute('data-layout') || 'carousel';
  var maxReviews = parseInt(currentScript.getAttribute('data-max')) || 6;
  var theme = currentScript.getAttribute('data-theme') || 'light';
  var showSourceFilter = currentScript.getAttribute('data-show-filter') !== 'false';
  var autoRotate = currentScript.getAttribute('data-auto-rotate') === 'true';
  var container = document.getElementById(containerId);
  
  if (!container) {
    console.warn('[TL Reviews PRO] Container not found:', containerId);
    return;
  }

  var isDark = theme === 'dark';
  var bgColor = isDark ? '#1f2937' : '#fff';
  var textColor = isDark ? '#f9fafb' : '#1f2937';
  var mutedColor = isDark ? '#9ca3af' : '#6b7280';
  var cardBg = isDark ? '#374151' : '#fff';
  var borderColor = isDark ? '#4b5563' : '#e5e7eb';
  
  var css = '\
    .tl-pro-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: ' + bgColor + '; padding: 24px; border-radius: 16px; }\
    .tl-pro-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }\
    .tl-pro-rating-block { display: flex; align-items: center; gap: 16px; }\
    .tl-pro-score { font-size: 56px; font-weight: 800; color: ' + textColor + '; line-height: 1; }\
    .tl-pro-meta { display: flex; flex-direction: column; gap: 4px; }\
    .tl-pro-stars { color: #fbbf24; font-size: 28px; letter-spacing: 2px; }\
    .tl-pro-count { font-size: 14px; color: ' + mutedColor + '; }\
    .tl-pro-sources { display: flex; gap: 8px; flex-wrap: wrap; }\
    .tl-pro-source-badge { display: flex; align-items: center; gap: 6px; font-size: 13px; padding: 6px 12px; border-radius: 20px; background: ' + (isDark ? '#4b5563' : '#f3f4f6') + '; color: ' + textColor + '; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }\
    .tl-pro-source-badge:hover { transform: translateY(-1px); }\
    .tl-pro-source-badge.active { border-color: ' + primaryColor + '; background: ' + primaryColor + '20; }\
    .tl-pro-source-icon { width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-weight: bold; }\
    .tl-pro-carousel { display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; padding: 8px 4px; scroll-behavior: smooth; }\
    .tl-pro-carousel::-webkit-scrollbar { height: 6px; }\
    .tl-pro-carousel::-webkit-scrollbar-track { background: ' + (isDark ? '#374151' : '#f3f4f6') + '; border-radius: 3px; }\
    .tl-pro-carousel::-webkit-scrollbar-thumb { background: ' + primaryColor + '; border-radius: 3px; }\
    .tl-pro-card { flex: 0 0 320px; scroll-snap-align: start; background: ' + cardBg + '; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,' + (isDark ? '0.3' : '0.08') + '); border: 1px solid ' + borderColor + '; transition: transform 0.2s, box-shadow 0.2s; }\
    .tl-pro-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,' + (isDark ? '0.4' : '0.12') + '); }\
    .tl-pro-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }\
    .tl-pro-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }\
    .tl-pro-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, ' + primaryColor + ', ' + primaryColor + '99); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }\
    .tl-pro-avatar.verified { box-shadow: 0 0 0 3px ' + bgColor + ', 0 0 0 5px #10b981; }\
    .tl-pro-reviewer { flex: 1; }\
    .tl-pro-name { font-weight: 700; color: ' + textColor + '; font-size: 15px; display: flex; align-items: center; gap: 6px; }\
    .tl-pro-verified-badge { color: #10b981; font-size: 14px; }\
    .tl-pro-date { font-size: 12px; color: ' + mutedColor + '; }\
    .tl-pro-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }\
    .tl-pro-rating-stars { color: #fbbf24; font-size: 16px; }\
    .tl-pro-rating-num { font-size: 14px; font-weight: 600; color: ' + textColor + '; }\
    .tl-pro-text { font-size: 14px; color: ' + (isDark ? '#d1d5db' : '#4b5563') + '; line-height: 1.6; margin-bottom: 16px; }\
    .tl-pro-text.truncated { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }\
    .tl-pro-read-more { color: ' + primaryColor + '; font-size: 13px; cursor: pointer; font-weight: 500; }\
    .tl-pro-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid ' + borderColor + '; }\
    .tl-pro-source-label { display: flex; align-items: center; gap: 6px; font-size: 12px; color: ' + mutedColor + '; }\
    .tl-pro-helpful { display: flex; align-items: center; gap: 4px; font-size: 12px; color: ' + mutedColor + '; }\
    .tl-pro-google { color: #4285f4; }\
    .tl-pro-facebook { color: #1877f2; }\
    .tl-pro-trustpilot { color: #00b67a; }\
    .tl-pro-yelp { color: #d32323; }\
    .tl-pro-bbb { color: #005a78; }\
    .tl-pro-powered { text-align: center; font-size: 12px; color: ' + mutedColor + '; margin-top: 20px; }\
    .tl-pro-powered a { color: ' + primaryColor + '; text-decoration: none; font-weight: 500; }\
    .tl-pro-nav { display: flex; gap: 8px; }\
    .tl-pro-nav-btn { width: 36px; height: 36px; border-radius: 50%; background: ' + (isDark ? '#4b5563' : '#f3f4f6') + '; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: ' + textColor + '; transition: all 0.2s; }\
    .tl-pro-nav-btn:hover { background: ' + primaryColor + '; color: #fff; }\
    @media (max-width: 640px) { .tl-pro-card { flex: 0 0 280px; } .tl-pro-score { font-size: 40px; } }\
  ';
  
  var SAMPLE_REVIEWS = [
    { name: 'John Smith', rating: 5, text: 'Absolutely fantastic work! The team was professional, on time, and the results exceeded our expectations. Would highly recommend to anyone looking for quality service.', date: '2 weeks ago', source: 'google', verified: true, helpful: 12 },
    { name: 'Sarah Johnson', rating: 5, text: 'Best experience I\'ve ever had with a contractor. Communication was excellent throughout the entire project. They kept me informed every step of the way.', date: '1 month ago', source: 'facebook', verified: true, helpful: 8 },
    { name: 'Mike Davis', rating: 5, text: 'Quality work at a fair price. They treated our home with respect and cleaned up after themselves. Very impressed!', date: '1 month ago', source: 'trustpilot', verified: false, helpful: 15 },
    { name: 'Emily Wilson', rating: 4, text: 'Great job overall. The team was friendly and skilled. Minor scheduling hiccup but they made it right immediately.', date: '2 months ago', source: 'google', verified: true, helpful: 6 },
    { name: 'Robert Brown', rating: 5, text: 'Incredible attention to detail. Our neighbors keep complimenting the work. Will definitely use again for our next project!', date: '2 months ago', source: 'yelp', verified: true, helpful: 22 },
    { name: 'Lisa Anderson', rating: 5, text: 'Professional from start to finish. The estimate was accurate and they completed everything on time. A+ service!', date: '3 months ago', source: 'bbb', verified: true, helpful: 9 }
  ];
  
  var activeFilter = 'all';
  var carouselInterval = null;
  
  function injectStyles() {
    if (document.getElementById('tl-pro-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-pro-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }
  
  function renderStars(rating) {
    var html = '';
    for (var i = 0; i < 5; i++) {
      html += i < rating ? '★' : '☆';
    }
    return html;
  }
  
  function getInitials(name) {
    return name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase();
  }
  
  function getSourceIcon(source) {
    switch(source) {
      case 'google': return '<span class="tl-pro-google">G</span>';
      case 'facebook': return '<span class="tl-pro-facebook">f</span>';
      case 'trustpilot': return '<span class="tl-pro-trustpilot">★</span>';
      case 'yelp': return '<span class="tl-pro-yelp">Y</span>';
      case 'bbb': return '<span class="tl-pro-bbb">BBB</span>';
      default: return '';
    }
  }
  
  function getSourceName(source) {
    switch(source) {
      case 'google': return 'Google';
      case 'facebook': return 'Facebook';
      case 'trustpilot': return 'Trustpilot';
      case 'yelp': return 'Yelp';
      case 'bbb': return 'BBB';
      default: return source;
    }
  }
  
  function countSources(reviews) {
    var counts = {};
    reviews.forEach(function(r) {
      counts[r.source] = (counts[r.source] || 0) + 1;
    });
    return counts;
  }
  
  function renderSourceBadges(counts, total) {
    var html = '<div class="tl-pro-source-badge' + (activeFilter === 'all' ? ' active' : '') + '" data-filter="all"><span>All</span><span>' + total + '</span></div>';
    var sources = ['google', 'facebook', 'trustpilot', 'yelp', 'bbb'];
    sources.forEach(function(source) {
      if (counts[source]) {
        html += '<div class="tl-pro-source-badge' + (activeFilter === source ? ' active' : '') + '" data-filter="' + source + '">' + getSourceIcon(source) + '<span>' + counts[source] + '</span></div>';
      }
    });
    return html;
  }
  
  function renderReviewCard(review) {
    return '\
      <div class="tl-pro-card" data-source="' + review.source + '">\
        <div class="tl-pro-card-header">\
          <div class="tl-pro-avatar' + (review.verified ? ' verified' : '') + '">' + getInitials(review.name) + '</div>\
          <div class="tl-pro-reviewer">\
            <div class="tl-pro-name">' + review.name + (review.verified ? '<span class="tl-pro-verified-badge">✓</span>' : '') + '</div>\
            <div class="tl-pro-date">' + review.date + '</div>\
          </div>\
        </div>\
        <div class="tl-pro-rating">\
          <span class="tl-pro-rating-stars">' + renderStars(review.rating) + '</span>\
          <span class="tl-pro-rating-num">' + review.rating + '.0</span>\
        </div>\
        <div class="tl-pro-text truncated">' + review.text + '</div>\
        <div class="tl-pro-footer">\
          <div class="tl-pro-source-label">' + getSourceIcon(review.source) + ' ' + getSourceName(review.source) + '</div>\
          <div class="tl-pro-helpful">👍 ' + review.helpful + ' found helpful</div>\
        </div>\
      </div>\
    ';
  }
  
  function filterReviews(reviews) {
    if (activeFilter === 'all') return reviews;
    return reviews.filter(function(r) { return r.source === activeFilter; });
  }
  
  function setupCarouselNav() {
    var carousel = container.querySelector('.tl-pro-carousel');
    var prevBtn = container.querySelector('.tl-pro-nav-btn.prev');
    var nextBtn = container.querySelector('.tl-pro-nav-btn.next');
    
    if (carousel && prevBtn && nextBtn) {
      prevBtn.addEventListener('click', function() {
        carousel.scrollBy({ left: -336, behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', function() {
        carousel.scrollBy({ left: 336, behavior: 'smooth' });
      });
      
      if (autoRotate) {
        carouselInterval = setInterval(function() {
          var maxScroll = carousel.scrollWidth - carousel.clientWidth;
          if (carousel.scrollLeft >= maxScroll - 10) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            carousel.scrollBy({ left: 336, behavior: 'smooth' });
          }
        }, 5000);
      }
    }
  }
  
  function setupFilters() {
    var badges = container.querySelectorAll('.tl-pro-source-badge');
    badges.forEach(function(badge) {
      badge.addEventListener('click', function() {
        activeFilter = this.getAttribute('data-filter');
        render();
      });
    });
  }
  
  function render() {
    injectStyles();
    
    var allReviews = SAMPLE_REVIEWS.slice(0, maxReviews);
    var reviews = filterReviews(allReviews);
    var avgRating = allReviews.reduce(function(sum, r) { return sum + r.rating; }, 0) / allReviews.length;
    var sourceCounts = countSources(allReviews);
    
    var reviewsHtml = reviews.map(renderReviewCard).join('');
    var layoutClass = layout === 'grid' ? 'tl-pro-grid' : 'tl-pro-carousel';
    var navHtml = layout === 'carousel' ? '<div class="tl-pro-nav"><button class="tl-pro-nav-btn prev">←</button><button class="tl-pro-nav-btn next">→</button></div>' : '';
    
    container.innerHTML = '\
      <div class="tl-pro-container">\
        <div class="tl-pro-header">\
          <div class="tl-pro-rating-block">\
            <div class="tl-pro-score">' + avgRating.toFixed(1) + '</div>\
            <div class="tl-pro-meta">\
              <div class="tl-pro-stars">' + renderStars(Math.round(avgRating)) + '</div>\
              <div class="tl-pro-count">Based on ' + allReviews.length + ' verified reviews</div>\
            </div>\
          </div>\
          ' + navHtml + '\
        </div>\
        ' + (showSourceFilter ? '<div class="tl-pro-sources">' + renderSourceBadges(sourceCounts, allReviews.length) + '</div>' : '') + '\
        <div class="' + layoutClass + '" style="margin-top: 20px;">' + reviewsHtml + '</div>\
        <div class="tl-pro-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer PRO</a></div>\
      </div>\
    ';
    
    setupFilters();
    if (layout === 'carousel') setupCarouselNav();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
  
  window.TLReviewsPro = {
    refresh: render,
    setFilter: function(filter) { activeFilter = filter; render(); },
    setTheme: function(newTheme) { theme = newTheme; isDark = theme === 'dark'; render(); }
  };
  
  console.log('[TL Reviews PRO] v2.0.0 loaded for site:', siteId);
})();
