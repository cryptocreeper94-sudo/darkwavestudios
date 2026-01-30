/**
 * TrustLayer Weather Widget
 * Version: 1.0.0
 */
(function() {
  'use strict';
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var containerId = currentScript.getAttribute('data-container') || 'tl-weather';
  var lat = currentScript.getAttribute('data-lat') || '36.1627';
  var lng = currentScript.getAttribute('data-lng') || '-86.7816';
  var units = currentScript.getAttribute('data-units') || 'fahrenheit';
  var container = document.getElementById(containerId);
  if (!container) {
    console.warn('[TL Weather] Container not found:', containerId);
    return;
  }
  var css = '\
    .tl-weather-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 400px; margin: 0 auto; background: linear-gradient(135deg, ' + primaryColor + ' 0%, #1e3a5f 100%); border-radius: 16px; padding: 24px; color: #fff; }\
    .tl-weather-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }\
    .tl-weather-location { font-size: 18px; font-weight: 600; }\
    .tl-weather-date { font-size: 14px; opacity: 0.8; margin-top: 4px; }\
    .tl-weather-status { font-size: 12px; background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 12px; }\
    .tl-weather-current { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }\
    .tl-weather-icon { font-size: 64px; }\
    .tl-weather-temp { font-size: 56px; font-weight: 700; }\
    .tl-weather-desc { font-size: 16px; opacity: 0.9; }\
    .tl-weather-details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 16px; background: rgba(255,255,255,0.1); border-radius: 12px; margin-bottom: 20px; }\
    .tl-weather-detail { text-align: center; }\
    .tl-weather-detail-value { font-size: 18px; font-weight: 600; }\
    .tl-weather-detail-label { font-size: 12px; opacity: 0.7; margin-top: 4px; }\
    .tl-weather-forecast { display: flex; gap: 8px; }\
    .tl-weather-day { flex: 1; text-align: center; padding: 12px 8px; background: rgba(255,255,255,0.1); border-radius: 10px; }\
    .tl-weather-day-name { font-size: 12px; opacity: 0.8; margin-bottom: 8px; }\
    .tl-weather-day-icon { font-size: 24px; margin-bottom: 4px; }\
    .tl-weather-day-temps { font-size: 12px; }\
    .tl-weather-day-high { font-weight: 600; }\
    .tl-weather-day-low { opacity: 0.7; }\
    .tl-weather-workday { margin-top: 16px; padding: 12px 16px; background: rgba(16,185,129,0.2); border-radius: 10px; border: 1px solid rgba(16,185,129,0.3); }\
    .tl-weather-workday-title { font-size: 12px; opacity: 0.9; margin-bottom: 4px; }\
    .tl-weather-workday-status { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; }\
    .tl-weather-powered { text-align: center; font-size: 11px; opacity: 0.6; margin-top: 16px; }\
    .tl-weather-powered a { color: #fff; text-decoration: none; }\
  ';
  var WEATHER_CODES = {
    0: { icon: '☀️', desc: 'Clear sky' },
    1: { icon: '🌤️', desc: 'Mainly clear' },
    2: { icon: '⛅', desc: 'Partly cloudy' },
    3: { icon: '☁️', desc: 'Overcast' },
    45: { icon: '🌫️', desc: 'Fog' },
    48: { icon: '🌫️', desc: 'Depositing rime fog' },
    51: { icon: '🌧️', desc: 'Light drizzle' },
    53: { icon: '🌧️', desc: 'Moderate drizzle' },
    55: { icon: '🌧️', desc: 'Dense drizzle' },
    61: { icon: '🌧️', desc: 'Slight rain' },
    63: { icon: '🌧️', desc: 'Moderate rain' },
    65: { icon: '🌧️', desc: 'Heavy rain' },
    71: { icon: '❄️', desc: 'Slight snow' },
    73: { icon: '❄️', desc: 'Moderate snow' },
    75: { icon: '❄️', desc: 'Heavy snow' },
    77: { icon: '🌨️', desc: 'Snow grains' },
    80: { icon: '🌦️', desc: 'Slight showers' },
    81: { icon: '🌦️', desc: 'Moderate showers' },
    82: { icon: '⛈️', desc: 'Violent showers' },
    85: { icon: '🌨️', desc: 'Slight snow showers' },
    86: { icon: '🌨️', desc: 'Heavy snow showers' },
    95: { icon: '⛈️', desc: 'Thunderstorm' },
    96: { icon: '⛈️', desc: 'Thunderstorm with hail' },
    99: { icon: '⛈️', desc: 'Thunderstorm with heavy hail' }
  };
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function injectStyles() {
    if (document.getElementById('tl-weather-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-weather-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }
  function convertTemp(celsius) {
    if (units === 'fahrenheit') {
      return Math.round(celsius * 9/5 + 32);
    }
    return Math.round(celsius);
  }
  function getWeatherInfo(code) {
    return WEATHER_CODES[code] || { icon: '🌡️', desc: 'Unknown' };
  }
  function isGoodWorkDay(code, temp, wind) {
    var badCodes = [51, 53, 55, 61, 63, 65, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99];
    if (badCodes.indexOf(code) !== -1) return false;
    if (temp < 35 || temp > 95) return false;
    if (wind > 25) return false;
    return true;
  }
  function formatDate(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }
  function fetchWeather() {
    var url = 'https://api.open-meteo.com/v1/forecast?' +
      'latitude=' + lat + '&longitude=' + lng +
      '&current=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m' +
      '&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto';
    
    fetch(url)
      .then(function(res) { return res.json(); })
      .then(function(data) { render(data); })
      .catch(function(err) {
        console.error('[TL Weather] Error fetching weather:', err);
        renderError();
      });
  }
  function render(data) {
    injectStyles();
    
    var current = data.current;
    var daily = data.daily;
    var weather = getWeatherInfo(current.weathercode);
    var temp = convertTemp(current.temperature_2m);
    var tempUnit = units === 'fahrenheit' ? '°F' : '°C';
    var goodDay = isGoodWorkDay(current.weathercode, temp, current.windspeed_10m);
    
    var forecastHtml = '';
    for (var i = 1; i < Math.min(6, daily.time.length); i++) {
      var dayDate = new Date(daily.time[i]);
      var dayWeather = getWeatherInfo(daily.weathercode[i]);
      forecastHtml += '\
        <div class="tl-weather-day">\
          <div class="tl-weather-day-name">' + DAYS[dayDate.getDay()] + '</div>\
          <div class="tl-weather-day-icon">' + dayWeather.icon + '</div>\
          <div class="tl-weather-day-temps">\
            <span class="tl-weather-day-high">' + convertTemp(daily.temperature_2m_max[i]) + '°</span>\
            <span class="tl-weather-day-low">' + convertTemp(daily.temperature_2m_min[i]) + '°</span>\
          </div>\
        </div>';
    }
    container.innerHTML = '\
      <div class="tl-weather-container">\
        <div class="tl-weather-header">\
          <div>\
            <div class="tl-weather-location">Nashville, TN</div>\
            <div class="tl-weather-date">' + formatDate(new Date()) + '</div>\
          </div>\
          <div class="tl-weather-status">Live</div>\
        </div>\
        <div class="tl-weather-current">\
          <div class="tl-weather-icon">' + weather.icon + '</div>\
          <div>\
            <div class="tl-weather-temp">' + temp + tempUnit + '</div>\
            <div class="tl-weather-desc">' + weather.desc + '</div>\
          </div>\
        </div>\
        <div class="tl-weather-details">\
          <div class="tl-weather-detail">\
            <div class="tl-weather-detail-value">' + current.relative_humidity_2m + '%</div>\
            <div class="tl-weather-detail-label">Humidity</div>\
          </div>\
          <div class="tl-weather-detail">\
            <div class="tl-weather-detail-value">' + Math.round(current.windspeed_10m) + ' mph</div>\
            <div class="tl-weather-detail-label">Wind</div>\
          </div>\
          <div class="tl-weather-detail">\
            <div class="tl-weather-detail-value">' + convertTemp(daily.temperature_2m_max[0]) + '/' + convertTemp(daily.temperature_2m_min[0]) + '</div>\
            <div class="tl-weather-detail-label">High/Low</div>\
          </div>\
        </div>\
        <div class="tl-weather-forecast">' + forecastHtml + '</div>\
        <div class="tl-weather-workday">\
          <div class="tl-weather-workday-title">Work Day Assessment</div>\
          <div class="tl-weather-workday-status">\
            ' + (goodDay ? '✅ Good conditions for outdoor work' : '⚠️ Check conditions before scheduling') + '\
          </div>\
        </div>\
        <div class="tl-weather-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
    ';
  }
  function renderError() {
    injectStyles();
    container.innerHTML = '\
      <div class="tl-weather-container">\
        <div style="text-align:center;padding:40px 20px;">\
          <div style="font-size:48px;margin-bottom:16px;">🌡️</div>\
          <div style="font-size:16px;">Unable to load weather</div>\
          <div style="font-size:14px;opacity:0.7;margin-top:8px;">Please try again later</div>\
        </div>\
      </div>\
    ';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchWeather);
  } else {
    fetchWeather();
  }
  window.TLWeather = { refresh: fetchWeather };
  console.log('[TL Weather] Loaded for site:', siteId);
})();
