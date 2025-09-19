import { render } from '../../scripts/shared.js';

/**
 * Returns cookie by cookie name
 *
 * @param name
 * @returns {string | undefined}
 */
// eslint-disable-next-line consistent-return
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

/**
 * Creates random GUID
 *
 * @returns {string}
 */
function getGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

function getUrlParameter(name) {
  const newName = name.replace(/\[/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${newName}=([^&#]*)`);
  // eslint-disable-next-line no-restricted-globals
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function getIframe() {
  let urlParams;
  (window.onpopstate = function () {
    let match;
    const pl = /\+/g;
    const search = /([^&=]+)=?([^&]*)/g;
    const decode = function (s) {
      return decodeURIComponent(s.replace(pl, ' '));
    };
    const query = window.location.search.substring(1);

    urlParams = {};
    // eslint-disable-next-line no-cond-assign
    while ((match = search.exec(query))) urlParams[decode(match[1])] = decode(match[2]);
  })();

  let guid = null;
  const cookieName = 'rm_c';
  const cookieTime = 60 * 24 * 10;
  const expiry = new Date();

  if (document.cookie.indexOf(`${cookieName}=`) >= 0) {
    guid = getCookie(cookieName);
  } else if (getUrlParameter(cookieName)) {
    guid = getUrlParameter(cookieName);
  } else {
    // Set a new cookie on the client domain
    expiry.setTime(expiry.getTime() + cookieTime * 60 * 1000); // Ten minutes
    guid = getGuid();
    document.cookie = `${cookieName}=${guid}; expires=${expiry.toGMTString()}; path=/; secure=true; SameSite=None`;
  }

  /**
   * Listens to events emitted from inside the iFrame
   */
  window.addEventListener('message', (message) => {
    if (message.origin.indexOf('.cvtr.io') >= 0 && typeof message.data === 'string') {
      let messageBody = {};
      try {
        messageBody = JSON.parse(message.data);
      } catch (e) {
        console.log('e', e);
      }

      if (typeof messageBody.type === 'string' && messageBody.type === 'unset_cookie') {
        const regex = new RegExp(`${cookieName}=.*`, 'g');
        if (document.cookie.match(regex) !== null) {
          document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;secure;path=/;SameSite=None`;
          window.location.reload(false);
        } else {
          // eslint-disable-next-line no-restricted-globals
          parent.window.postMessage(message.data, getUrlParameter('ourl'));
        }
      }
    }
  });
  let iframe;
  if (typeof urlParams.url !== 'undefined') {
    iframe = render(
      `<iframe src="${urlParams.url}&purl=${window.location.hostname}&lpp_ourl=${window.location.origin}&lpp_rm_c=${guid}&lpp_turl=${encodeURI(encodeURIComponent(window.location.href))}" width="100%" class="cvtrIframe" allowTransparency="true" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>`
    );
  }

  return iframe;
}

export default async function decorate(block) {
  const convertrLink = block.querySelector('a');
  const linkHref = convertrLink.getAttribute('href');

  const script = document.createElement('script');
  script.setAttribute('src', `${linkHref}`);
  script.setAttribute('type', 'text/javascript');
  convertrLink.parentElement.parentElement.remove();

  const iframe = getIframe();

  block.append(iframe);
}
