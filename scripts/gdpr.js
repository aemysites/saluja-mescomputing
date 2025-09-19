/* eslint-disable */
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.async = true;
  script.onload = function () {
    if (callback && typeof callback === 'function') {
      callback();
    }
  };
  document.head.appendChild(script);
}

'use strict';
function _typeof(t) {
  return (_typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function (t) { return typeof t; }
    : function (t) { return t && typeof Symbol === 'function' && t.constructor === Symbol && t !== Symbol.prototype ? 'symbol' : typeof t; })(t);
}

!(function () {
  const t = function () {
    let t;
    let e;
    const o = [];
    const n = window;
    let r = n;
    for (;r;) {
      try {
        if (r.frames.__tcfapiLocator) {
          t = r;
          break;
        }
      } catch (t) {}
      if (r === n.top) break;
      r = r.parent;
    }
    t || (!(function t() {
      const e = n.document;
      const o = !!n.frames.__tcfapiLocator;
      if (!o) if (e.body) {
        const r = e.createElement('iframe');
        r.style.cssText = 'display:none';
        r.name = '__tcfapiLocator';
        e.body.appendChild(r);
      } else setTimeout(t, 5);
      return !o;
    }()),
    n.__tcfapi = function () {
      for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++) n[r] = arguments[r];
      if (!n.length) return o;
      n[0] === 'setGdprApplies'
        ? n.length > 3 && parseInt(n[1], 10) === 2 && typeof n[3] === 'boolean' && (e = n[3], typeof n[2] === 'function' && n[2]('set', !0))
        : n[0] === 'ping'
          ? typeof n[2] === 'function' && n[2]({ gdprApplies: e, cmpLoaded: !1, cmpStatus: 'stub' })
          : o.push(n);
    },
    n.addEventListener('message', ((t) => {
      const e = typeof t.data === 'string';
      let o = {};
      if (e) try {
        o = JSON.parse(t.data);
      } catch (t) {}
      else o = t.data;
      const n = _typeof(o) === 'object' && o !== null ? o.__tcfapiCall : null;
      n && window.__tcfapi(n.command, n.version, ((o, r) => {
        const a = { __tcfapiReturn: { returnValue: o, success: r, callId: n.callId } };
        t && t.source && t.source.postMessage && t.source.postMessage(e ? JSON.stringify(a) : a, '*');
      }), n.parameter);
    }), !1));
  };
  typeof module !== 'undefined' ? module.exports = t : t();
}());

(function () {
  window.__gpp_addFrame = function (e) {
    if (!window.frames[e]) if (document.body) {
      var t = document.createElement('iframe');
      t.style.cssText = 'display:none';
      t.name = e;
      document.body.appendChild(t);
    } else window.setTimeout(window.__gpp_addFrame, 10, e);
  };

  window.__gpp_stub = function () {
    var e = arguments;
    if (__gpp.queue = __gpp.queue || [], __gpp.events = __gpp.events || [], !e.length || 1 == e.length && 'queue' == e[0]) return __gpp.queue;
    if (1 == e.length && 'events' == e[0]) return __gpp.events;
    var t = e[0], p = e.length > 1 ? e[1] : null, s = e.length > 2 ? e[2] : null;
    if ('ping' === t) p({ gppVersion: '1.1', cmpStatus: 'stub', cmpDisplayStatus: 'hidden', signalStatus: 'not ready', supportedAPIs: ['2:tcfeuv2', '5:tcfcav1', '6:uspv1', '7:usnat', '8:usca', '9:usva', '10:usco', '11:usut', '12:usct'], cmpId: 0, sectionList: [], applicableSections: [], gppString: '', parsedSections: {} }, !0);
    else if ('addEventListener' === t) {
      'lastId' in __gpp || (__gpp.lastId = 0), __gpp.lastId++;
      var n = __gpp.lastId;
      __gpp.events.push({ id: n, callback: p, parameter: s }), p({ eventName: 'listenerRegistered', listenerId: n, data: !0, pingData: { gppVersion: '1.1', cmpStatus: 'stub', cmpDisplayStatus: 'hidden', signalStatus: 'not ready', supportedAPIs: ['2:tcfeuv2', '5:tcfcav1', '6:uspv1', '7:usnat', '8:usca', '9:usva', '10:usco', '11:usut', '12:usct'], cmpId: 0, sectionList: [], applicableSections: [], gppString: '', parsedSections: {} } }, !0);
    } else if ('removeEventListener' === t) {
      for (var a = !1, i = 0; i < __gpp.events.length; i++) if (__gpp.events[i].id == s) {
        __gpp.events.splice(i, 1), a = !0;
        break;
      }
      p({ eventName: 'listenerRemoved', listenerId: s, data: a, pingData: { gppVersion: '1.1', cmpStatus: 'stub', cmpDisplayStatus: 'hidden', signalStatus: 'not ready', supportedAPIs: ['2:tcfeuv2', '5:tcfcav1', '6:uspv1', '7:usnat', '8:usca', '9:usva', '10:usco', '11:usut', '12:usct'], cmpId: 0, sectionList: [], applicableSections: [], gppString: '', parsedSections: {} } }, !0);
    } else 'hasSection' === t ? p(!1, !0) : 'getSection' === t || 'getField' === t ? p(null, !0) : __gpp.queue.push([].slice.apply(e));
  };

  window.__gpp_msghandler = function (e) {
    var t = 'string' == typeof e.data;
    try {
      var p = t ? JSON.parse(e.data) : e.data;
    } catch (e) {
      p = null;
    }
    if ('object' == typeof p && null !== p && '__gppCall' in p) {
      var s = p.__gppCall;
      window.__gpp(s.command, (function (p, n) {
        var a = { __gppReturn: { returnValue: p, success: n, callId: s.callId } };
        e.source.postMessage(t ? JSON.stringify(a) : a, '*');
      }), 'parameter' in s ? s.parameter : null, 'version' in s ? s.version : '1.1');
    }
  };

  '__gpp' in window && 'function' == typeof window.__gpp || (window.__gpp = window.__gpp_stub, window.addEventListener('message', window.__gpp_msghandler, !1), window.__gpp_addFrame('__gppLocator'));
}());

const siteName = document.querySelector('meta[name="theme"]').content;
function identifySite(siteName) {
  const site = {
    'mescomputing-com': 'http://mescomputing.com',
    'channelweb-co-uk': 'http://channelweb.co.uk',
    'computing-co-uk': 'http://computing.co.uk',
    'crn-de': 'http://crn.de',
    'computing-de': 'http://computingdeutschland.de',
    'crn-asia': 'http://crnasia.com',
    'crn-australia': 'http://crn.com.au',
  };

  return site[siteName] ?? console.error('Cookie policy failed to load because site was not identified.');
}

window._sp_queue = [];
window._sp_ = {
  config: {
    accountId: 1852,
    baseEndpoint: 'https://cdn.privacy-mgmt.com',
    propertyHref: `${identifySite(siteName)}`,
    usnat: { },
    gdpr: { },
    events: {
      onMessageReady() {
        console.log('[event] onMessageReady', arguments);
      },
      onMessageReceiveData() {
        console.log('[event] onMessageReceiveData', arguments);
      },
      onSPReady() {
        console.log('[event] onSPReady', arguments);
      },
      onError() {
        console.log('[event] onError', arguments);
      },
      onMessageChoiceSelect() {
        console.log('[event] onMessageChoiceSelect', arguments);
      },
      onConsentReady(consentUUID, euconsent) {
        console.log('[event] onConsentReady', arguments);
      },
      onPrivacyManagerAction() {
        console.log('[event] onPrivacyManagerAction', arguments);
      },
      onPMCancel() {
        console.log('[event] onPMCancel', arguments);
      }
    }
  }
};

loadScript('https://cdn.privacy-mgmt.com/unified/wrapperMessagingWithoutDetection.js', () => {
  console.log('External script has been loaded.');
});

