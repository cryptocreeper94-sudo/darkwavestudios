(function() {
  'use strict';

  var TL_SHARED = {
    version: '1.0.0',
    baseUrl: '',
    loaded: {},
    config: {
      theme: 'dark',
      autoLoad: [],
      target: {}
    },

    init: function(options) {
      options = options || {};
      this.baseUrl = options.baseUrl || this.detectBaseUrl();
      Object.assign(this.config, options);

      if (this.config.autoLoad && this.config.autoLoad.length > 0) {
        this.loadComponents(this.config.autoLoad);
      }
    },

    detectBaseUrl: function() {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.indexOf('tl-shared-loader') !== -1) {
          return scripts[i].src.replace(/\/(?:api\/ecosystem\/shared\/loader\.js|widgets\/tl-shared-loader\.js).*$/, '');
        }
      }
      return 'https://dwsc.io';
    },

    loadComponents: function(slugs) {
      var self = this;
      if (typeof slugs === 'string') slugs = [slugs];

      slugs.forEach(function(slug) {
        self.loadComponent(slug);
      });
    },

    loadComponent: function(slug, options) {
      var self = this;
      options = options || {};
      var theme = options.theme || this.config.theme || 'dark';
      var targetId = options.target || this.config.target[slug] || 'dw-shared-' + slug;

      var url = this.baseUrl + '/api/ecosystem/shared/render/' + slug + '?theme=' + theme;

      return fetch(url)
        .then(function(r) { return r.text(); })
        .then(function(html) {
          if (html.indexOf('<!-- Component not found -->') !== -1) {
            console.warn('[TL Shared] Component not found: ' + slug);
            return;
          }

          var target = document.getElementById(targetId);
          if (!target) {
            target = document.createElement('div');
            target.id = targetId;
            target.setAttribute('data-tl-component', slug);

            if (slug.indexOf('footer') !== -1) {
              document.body.appendChild(target);
            } else if (slug.indexOf('header') !== -1 || slug.indexOf('banner') !== -1 || slug.indexOf('announcement') !== -1) {
              document.body.insertBefore(target, document.body.firstChild);
            } else {
              document.body.appendChild(target);
            }
          }

          target.innerHTML = html;

          var scripts = target.querySelectorAll('script');
          scripts.forEach(function(oldScript) {
            var newScript = document.createElement('script');
            if (oldScript.src) {
              newScript.src = oldScript.src;
            } else {
              newScript.textContent = oldScript.textContent;
            }
            oldScript.parentNode.replaceChild(newScript, oldScript);
          });

          self.loaded[slug] = { version: 1, loadedAt: new Date().toISOString() };
          self.emit('component:loaded', { slug: slug });
        })
        .catch(function(err) {
          console.warn('[TL Shared] Failed to load: ' + slug, err);
          self.emit('component:error', { slug: slug, error: err });
        });
    },

    loadBundle: function(slugs, options) {
      var self = this;
      options = options || {};
      var theme = options.theme || this.config.theme || 'dark';
      var components = Array.isArray(slugs) ? slugs.join(',') : slugs;

      var url = this.baseUrl + '/api/ecosystem/shared/bundle?components=' + encodeURIComponent(components) + '&theme=' + theme;

      return fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (!data.success) return;

          if (data.css) {
            var style = document.createElement('style');
            style.id = 'tl-shared-bundle-css';
            style.textContent = data.css;
            var existing = document.getElementById('tl-shared-bundle-css');
            if (existing) existing.remove();
            document.head.appendChild(style);
          }

          if (data.html) {
            data.components.forEach(function(slug) {
              var targetId = self.config.target[slug] || 'dw-shared-' + slug;
              var target = document.getElementById(targetId);
              if (target) {
                var regex = new RegExp('<!-- ' + slug + ' -->\\n([\\s\\S]*?)(?=<!-- |$)');
                var match = data.html.match(regex);
                if (match) target.innerHTML = match[1].trim();
              }
            });
          }

          if (data.js) {
            var script = document.createElement('script');
            script.textContent = data.js;
            document.body.appendChild(script);
          }

          data.components.forEach(function(slug) {
            self.loaded[slug] = { version: data.version, loadedAt: new Date().toISOString() };
          });
          self.emit('bundle:loaded', { components: data.components });
        })
        .catch(function(err) {
          console.warn('[TL Shared] Bundle load failed', err);
        });
    },

    listAvailable: function() {
      return fetch(this.baseUrl + '/api/ecosystem/shared/components')
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data.success) return data.components;
          return [];
        });
    },

    getLoaded: function() {
      return Object.assign({}, this.loaded);
    },

    refresh: function(slug) {
      if (slug) {
        return this.loadComponent(slug);
      }
      var slugs = Object.keys(this.loaded);
      if (slugs.length > 0) {
        return this.loadComponents(slugs);
      }
    },

    listeners: {},

    on: function(event, fn) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(fn);
    },

    emit: function(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(function(fn) { fn(data); });
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.TLShared = TL_SHARED;

    if (document.currentScript) {
      var autoLoad = document.currentScript.getAttribute('data-components');
      var theme = document.currentScript.getAttribute('data-theme');
      var baseUrl = document.currentScript.getAttribute('data-base-url');

      if (autoLoad || theme || baseUrl) {
        var initOpts = {};
        if (baseUrl) initOpts.baseUrl = baseUrl;
        if (theme) initOpts.theme = theme;
        if (autoLoad) initOpts.autoLoad = autoLoad.split(',').map(function(s) { return s.trim(); });

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function() {
            TL_SHARED.init(initOpts);
          });
        } else {
          TL_SHARED.init(initOpts);
        }
      }
    }
  }
})();
