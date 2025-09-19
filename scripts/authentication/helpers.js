import {
  API_BASE_URL,
  API_KEY,
  ARTICLE_GATED_DAYS,
  COOKIE_USER_ID,
  COOKIE_USER_NAME,
  IV,
  PASS_PHRASE,
  COOKIE_USER_SUB,
} from './constants.js';
import { getMetadata } from '../aem.js';
import { logout as logoutApi } from './apiClient.js';

async function getHmac(secretKey, data) {
  const enc = new TextEncoder('utf-8');

  return crypto.subtle
    .importKey(
      'raw', // raw format of the key - should be Uint8Array
      enc.encode(secretKey),
      {
        // algorithm details
        name: 'HMAC',
        hash: { name: 'SHA-1' },
      },
      false, // export = false
      ['sign', 'verify'] // what this key can do
    )
    .then((key) =>
      crypto.subtle.sign('HMAC', key, enc.encode(data)).then((signature) => {
        const b = new Uint8Array(signature);
        return Array.prototype.map
          .call(
            b /**
             * @param {number} x
             * @returns {string}
             */,
            (x) => x.toString(16).padStart(2, '0')
          )
          .join('');
      })
    );
}

async function encrypt(plainText, passPhrase) {
  // from Wyvern documentation
  const ivString = IV;
  const enc = new TextEncoder('utf-8');

  const key = await crypto.subtle.importKey('raw', passPhrase, 'AES-CBC', false, ['encrypt', 'decrypt']);

  const params = {
    name: 'AES-CBC',
    iv: enc.encode(ivString),
  };

  return await crypto.subtle.encrypt(params, key, enc.encode(plainText));
}

export async function decrypt(data) {
  // from Wyvern documentation
  const ivString = IV;
  const enc = new TextEncoder('utf-8');

  const key = await crypto.subtle.importKey('raw', PASS_PHRASE, 'AES-CBC', false, ['encrypt', 'decrypt']);

  const params = {
    name: 'AES-CBC',
    iv: enc.encode(ivString),
  };

  const urlDecodedData1 = decodeURIComponent(data);
  const urlDecodedData2 = decodeURIComponent(urlDecodedData1);
  const withoutData = urlDecodedData2.replace('data=', '');
  const base64Decoded = b642ab(withoutData);

  return await crypto.subtle.decrypt(params, key, base64Decoded);
}

function b642ab(base64string) {
  return Uint8Array.from(atob(base64string), (c) => c.charCodeAt(0));
}

export async function buildApiUrl(urlSearchParams) {
  const hmac = await getHmac(urlSearchParams.toString(), API_KEY);
  urlSearchParams.append('Hmac', hmac.toString().toUpperCase());

  const queryString = urlSearchParams.toString();
  const encryptedQueryString = await encrypt(queryString, PASS_PHRASE);
  const encryptedQueryStringBytes = new Uint8Array(encryptedQueryString);
  const base64QueryString = btoa(String.fromCharCode(...encryptedQueryStringBytes));

  const url = new URL(API_BASE_URL);
  url.searchParams.set('Data', `Data=${base64QueryString}`);

  return url.toString();
}

export const getCurrentCookie = (expectedCookieName) => {
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${expectedCookieName.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`)
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const deleteCookie = (cookieName) => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const getUserId = () => getCurrentCookie(COOKIE_USER_ID);
export const getUserName = () => getCurrentCookie(COOKIE_USER_NAME);
export const getUserSub = () => getCurrentCookie(COOKIE_USER_SUB);
export const isLoggedIn = () => !!getUserId();
export const isSubbed = () => !!getUserSub();
export const isGated = () => getMetadata('gated') !== 'off';
export const articleDateOlderThen48Hours = (publisheddate) => {
  const publishedDate = new Date(publisheddate);
  const today = new Date();
  const diffTime = Math.abs(today - publishedDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= ARTICLE_GATED_DAYS;
};

export const shouldBeGated = (publisheddate, articleType) =>
  articleDateOlderThen48Hours(publisheddate) &&
  (!isLoggedIn() || !isSubbed()) &&
  isGated() &&
  articleType !== 'content-hub';

export async function logout() {
  const response = await logoutApi(getUserId());
  console.log('LOGOUT');
  console.log('=======================');
  console.log('=======================');
  deleteCookie(COOKIE_USER_NAME);
  deleteCookie(COOKIE_USER_ID);
  deleteCookie(COOKIE_USER_SUB);
  window.location = '/';
}
