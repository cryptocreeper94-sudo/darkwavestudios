/**
 * TrustLayer Booking Widget
 * Version: 1.0.0
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var containerId = currentScript.getAttribute('data-container') || 'tl-booking';
  var webhookUrl = currentScript.getAttribute('data-webhook-url');
  var businessName = currentScript.getAttribute('data-business') || 'Our Team';
  var container = document.getElementById(containerId);
  if (!container) {
    console.warn('[TL Booking] Container not found:', containerId);
    return;
  }
  var selectedDate = null;
  var selectedTime = null;
  var currentMonth = new Date();
  var css = '\
    .tl-book-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 400px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.12); overflow: hidden; }\
    .tl-book-header { background: ' + primaryColor + '; color: #fff; padding: 20px; text-align: center; }\
    .tl-book-title { font-size: 20px; font-weight: 700; margin-bottom: 4px; }\
    .tl-book-subtitle { font-size: 14px; opacity: 0.9; }\
    .tl-book-calendar { padding: 20px; }\
    .tl-book-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }\
    .tl-book-nav-btn { background: none; border: none; font-size: 20px; cursor: pointer; padding: 8px; color: #374151; }\
    .tl-book-month { font-size: 16px; font-weight: 600; color: #1f2937; }\
    .tl-book-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 12px; color: #6b7280; margin-bottom: 8px; }\
    .tl-book-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }\
    .tl-book-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 14px; border-radius: 50%; cursor: pointer; transition: all 0.2s; }\
    .tl-book-day:hover { background: #f3f4f6; }\
    .tl-book-day.disabled { color: #d1d5db; cursor: not-allowed; }\
    .tl-book-day.disabled:hover { background: none; }\
    .tl-book-day.selected { background: ' + primaryColor + '; color: #fff; }\
    .tl-book-day.today { border: 2px solid ' + primaryColor + '; }\
    .tl-book-times { padding: 0 20px 20px; }\
    .tl-book-times-title { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px; }\
    .tl-book-times-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\
    .tl-book-time { padding: 10px; text-align: center; font-size: 14px; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s; }\
    .tl-book-time:hover { border-color: ' + primaryColor + '; }\
    .tl-book-time.selected { border-color: ' + primaryColor + '; background: ' + primaryColor + '15; color: ' + primaryColor + '; font-weight: 600; }\
    .tl-book-form { padding: 0 20px 20px; display: none; }\
    .tl-book-form.active { display: block; }\
    .tl-book-field { margin-bottom: 12px; }\
    .tl-book-label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px; }\
    .tl-book-input { width: 100%; padding: 10px 12px; font-size: 14px; border: 2px solid #e5e7eb; border-radius: 8px; box-sizing: border-box; }\
    .tl-book-input:focus { outline: none; border-color: ' + primaryColor + '; }\
    .tl-book-btn { width: 100%; padding: 14px; font-size: 16px; font-weight: 600; color: #fff; background: ' + primaryColor + '; border: none; border-radius: 8px; cursor: pointer; }\
    .tl-book-btn:hover { opacity: 0.9; }\
    .tl-book-btn:disabled { opacity: 0.5; cursor: not-allowed; }\
    .tl-book-success { padding: 40px 20px; text-align: center; }\
    .tl-book-success-icon { font-size: 48px; margin-bottom: 16px; }\
    .tl-book-powered { text-align: center; font-size: 11px; color: #9ca3af; padding: 12px; }\
    .tl-book-powered a { color: ' + primaryColor + '; text-decoration: none; }\
  ';
  var TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function injectStyles() {
    if (document.getElementById('tl-book-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-book-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }
  function sendWebhook(data) {
    if (!webhookUrl) return;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', webhookUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      event: 'booking.created',
      siteId: siteId,
      timestamp: new Date().toISOString(),
      data: data
    }));
  }
  function renderCalendar() {
    var year = currentMonth.getFullYear();
    var month = currentMonth.getMonth();
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var daysHtml = '';
    for (var i = 0; i < firstDay; i++) {
      daysHtml += '<div class="tl-book-day disabled"></div>';
    }
    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(year, month, d);
      var isPast = date < today;
      var isToday = date.getTime() === today.getTime();
      var isSelected = selectedDate && date.getTime() === selectedDate.getTime();
      var classes = 'tl-book-day';
      if (isPast) classes += ' disabled';
      if (isToday) classes += ' today';
      if (isSelected) classes += ' selected';
      daysHtml += '<div class="' + classes + '" data-date="' + date.toISOString() + '">' + d + '</div>';
    }
    return '\
      <div class="tl-book-nav">\
        <button class="tl-book-nav-btn" id="tl-prev-month">&lt;</button>\
        <div class="tl-book-month">' + MONTHS[month] + ' ' + year + '</div>\
        <button class="tl-book-nav-btn" id="tl-next-month">&gt;</button>\
      </div>\
      <div class="tl-book-weekdays">' + WEEKDAYS.map(function(d) { return '<div>' + d + '</div>'; }).join('') + '</div>\
      <div class="tl-book-days">' + daysHtml + '</div>\
    ';
  }
  function renderTimes() {
    return TIMES.map(function(time) {
      var isSelected = selectedTime === time;
      return '<div class="tl-book-time' + (isSelected ? ' selected' : '') + '" data-time="' + time + '">' + time + '</div>';
    }).join('');
  }
  function render() {
    injectStyles();
    container.innerHTML = '\
      <div class="tl-book-container">\
        <div class="tl-book-header">\
          <div class="tl-book-title">Book an Appointment</div>\
          <div class="tl-book-subtitle">Schedule your free consultation</div>\
        </div>\
        <div class="tl-book-calendar" id="tl-calendar"></div>\
        <div class="tl-book-times">\
          <div class="tl-book-times-title">Available Times</div>\
          <div class="tl-book-times-grid" id="tl-times"></div>\
        </div>\
        <div class="tl-book-form" id="tl-form">\
          <div class="tl-book-field"><label class="tl-book-label">Name</label><input type="text" class="tl-book-input" id="tl-name" placeholder="Your name"></div>\
          <div class="tl-book-field"><label class="tl-book-label">Email</label><input type="email" class="tl-book-input" id="tl-email" placeholder="you@example.com"></div>\
          <div class="tl-book-field"><label class="tl-book-label">Phone</label><input type="tel" class="tl-book-input" id="tl-phone" placeholder="(555) 123-4567"></div>\
          <button class="tl-book-btn" id="tl-submit">Confirm Booking</button>\
        </div>\
        <div class="tl-book-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
    ';
    document.getElementById('tl-calendar').innerHTML = renderCalendar();
    document.getElementById('tl-times').innerHTML = renderTimes();
    bindEvents();
  }
  function bindEvents() {
    document.getElementById('tl-prev-month').addEventListener('click', function() {
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      document.getElementById('tl-calendar').innerHTML = renderCalendar();
      bindCalendarEvents();
    });
    document.getElementById('tl-next-month').addEventListener('click', function() {
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      document.getElementById('tl-calendar').innerHTML = renderCalendar();
      bindCalendarEvents();
    });
    bindCalendarEvents();
    bindTimeEvents();
    document.getElementById('tl-submit').addEventListener('click', function() {
      var name = document.getElementById('tl-name').value.trim();
      var email = document.getElementById('tl-email').value.trim();
      var phone = document.getElementById('tl-phone').value.trim();
      if (!name || !email) {
        alert('Please fill in your name and email');
        return;
      }
      var booking = {
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        name: name,
        email: email,
        phone: phone
      };
      sendWebhook(booking);
      if (window.TLAnalytics) {
        window.TLAnalytics.track('booking_created', booking);
      }
      container.querySelector('.tl-book-container').innerHTML = '\
        <div class="tl-book-success">\
          <div class="tl-book-success-icon">✓</div>\
          <div style="font-size:20px;font-weight:700;color:#1f2937;margin-bottom:8px;">Booking Confirmed!</div>\
          <p style="color:#6b7280;margin-bottom:4px;">' + selectedDate.toLocaleDateString() + ' at ' + selectedTime + '</p>\
          <p style="color:#6b7280;">We\'ll send a confirmation to ' + email + '</p>\
        </div>\
        <div class="tl-book-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      ';
    });
  }
  function bindCalendarEvents() {
    container.querySelectorAll('.tl-book-day:not(.disabled)').forEach(function(el) {
      el.addEventListener('click', function() {
        container.querySelectorAll('.tl-book-day').forEach(function(d) { d.classList.remove('selected'); });
        el.classList.add('selected');
        selectedDate = new Date(el.getAttribute('data-date'));
        checkShowForm();
      });
    });
  }
  function bindTimeEvents() {
    container.querySelectorAll('.tl-book-time').forEach(function(el) {
      el.addEventListener('click', function() {
        container.querySelectorAll('.tl-book-time').forEach(function(t) { t.classList.remove('selected'); });
        el.classList.add('selected');
        selectedTime = el.getAttribute('data-time');
        checkShowForm();
      });
    });
  }
  function checkShowForm() {
    var form = document.getElementById('tl-form');
    if (selectedDate && selectedTime) {
      form.classList.add('active');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
  window.TLBooking = { refresh: render };
  console.log('[TL Booking] Loaded for site:', siteId);
})();
