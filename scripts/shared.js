/* eslint-disable import/extensions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import { buildBlock, loadBlock, decorateBlock, getMetadata } from './aem.js';

const r = document.createRange();
export function render(html) {
  return r.createContextualFragment(html);
}

/**
 * Checks whether a given value appears to be a timestamp, and if so converts it
 * into a formatted date string (in DD-MM-YYYY). Otherwise the method will return
 * the original value as-is.
 * @param {string} dateValue Potential date value to format.
 * @returns {string} Formatted date, or the original value.
 */
export function formatDate(dateValue) {
  const publishDate = new Date(dateValue.trim());
  if (Number.isNaN(publishDate.getTime())) return dateValue;
  const dateStr = publishDate.toLocaleDateString('en-us', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
  return dateStr.split('/').reverse().join('-');
}

/**
 * Converts a UNIX timestamp to a formatted date string
 * @param {string} unixTimestamp The UNIX timestamp
 * @returns {string} Formatted date string in DD-MM-YYYY
 */
export function formatDateByDMY(unixTimestamp) {
  const date = new Date(unixTimestamp.trim());
  const optionsDate = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-GB', optionsDate);
  const newDate = formattedDate.replaceAll('/', '-');
  return `${newDate}`;
}

export function getTheTheme() {
  return getMetadata('theme');
}

export function formatDateByDMYbyName(unixTimestamp) {
  const theme = getTheTheme();
  const date = new Date(unixTimestamp.trim());
  let optionsDate;

  if (theme === 'crn-de' || theme === 'computing-de') {
    optionsDate = date.toLocaleString('de', { year: 'numeric', month: 'long', day: 'numeric' });
  } else {
    optionsDate = date.toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  return `${optionsDate}`;
}

export function formatDateByDMbyName(unixTimestamp) {
  const theme = getTheTheme();
  const date = new Date(unixTimestamp.trim());

  let optionsDate;

  if (theme === 'mescomputing-com') {
    optionsDate = date.toLocaleString('en-US', { month: 'long', day: '2-digit' });
  } else {
    optionsDate = date.toLocaleString('en-GB', { month: 'short', day: '2-digit' });
  }

  return `${optionsDate}`;
}

/**
 * Converts a date string to a formatted date string in MM-DD-YYYY format
 * @param {string} dateString The input date string
 * @returns {string} Formatted date string
 */
export function formatDateByMDY(dateString) {
  const date = new Date(dateString.trim());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

export function sortArticlesByPublishDate(articles) {
  return articles.sort((a, b) => b.publisheddate.localeCompare(a.publisheddate));
}

export function sortEventsByDate(events) {
  return events.sort((a, b) => a.event_start_date.localeCompare(b.event_start_date));
}

// [NEW FUNCTION] -- UNIVERSAL DATE->ISO8601 CONVERTER
/**
 * Converts any recognized date string (ISO8601, CRN "long" format, or numeric Unix timestamp)
 * into a strict ISO 8601 string. If parsing fails, returns the original value.
 *
 * Examples:
 *   - Already ISO: "2024-10-23T13:55:19" -> "2024-10-23T13:55:19" (unchanged)
 *   - CRN date: "October 23, 2024, 9:57 AM EDT" -> "2024-10-23T13:57:00.000Z" (UTC)
 *   - Unix TS: "1677628800" -> "2023-02-28T05:00:00.000Z" (example)
 */
export function formatToISO8601(dateValue) {
  if (!dateValue) return dateValue;
  const trimmed = dateValue.trim();

  // Already in ISO8601? Return as-is.
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(trimmed)) {
    return trimmed;
  }

  // Numeric only => treat as Unix timestamp (in seconds).
  if (/^[0-9]+$/.test(trimmed)) {
    const asNumber = Number(trimmed) * 1000;
    const d = new Date(asNumber);
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString();
    }
    return dateValue;
  }

  // Otherwise, try normal Date parsing (handles "October 23, 2024, 9:57 AM EDT", etc).
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }
  return parsed.toISOString(); // UTC
}

// Update links in development
function getLocalhostPort(theme) {
  const localhostPorts = {
    'mescomputing-com': '3010',
    'computing-co-uk': '3011',
    'crn-de': '3012',
    'channelweb-co-uk': '3013',
    'crn-asia': '3014',
    'crn-australia': '3015',
    'computing-de': '3016',
  };
  return localhostPorts[theme] ?? '';
}

export function getTheUrl() {
  const theme = getMetadata('theme');
  if (window.location.hostname === 'localhost') {
    const port = getLocalhostPort(theme);
    return `http://localhost:${port}`;
  }
  return `https://main--${theme}--thechannelcompany.aem.live`;
}

export function index() {
  return '/query-index.json';
}

export function articleIndex() {
  return '/article-query-index.json';
}

export function queryIndex() {
  return `${getTheUrl()}${index()}`;
}

export function articleQueryIndex() {
  return `${getTheUrl()}${articleIndex()}`;
}

/**
 * Fetches articles from a specified URL and generates a card for each article
 * If the specified sheet is not found, it fetches articles without specifying a sheet
 * @param {string} url The URL to fetch articles from
 */
// helper function to collect all articles from the generator
// [MODIFIED] -- calling our new formatToISO8601 function
export async function all(generator) {
  const result = [];
  for await (const item of generator) {
    if (item.publisheddate) {
      // [CALL OUR NEW FUNCTION]
      item.publisheddate = formatToISO8601(item.publisheddate);
      result.push(item);
    }
  }
  return result;
}

/** Moves a block to the middle section of the page
 * @param main
 * @param block
 */
export async function moveToMiddleSection(main, block) {
  const middleSection = main.querySelector('.middle-section');
  if (middleSection && block) {
    middleSection.appendChild(block);
  }
}

/** Moves a  block to the right section of the page
 * @param main
 * @param block
 */
export function moveToRightSection(main, block) {
  const rightSection = main.querySelector('.right-section');
  if (rightSection && block) {
    rightSection.appendChild(block);
  }
}

/** Moves a block to the bottom section of the page.
 * @param main
 * @param block
 */
export function moveToBottomSection(main, block) {
  const bottomSection = main.querySelector('.bottom-section');
  if (bottomSection && block) {
    bottomSection.appendChild(block);
  }
}

/**
 * Creates the social heading block
 */
export async function buildSocialHeadingTop(insertAfter = null) {
  const socialHeading = buildBlock('social-heading', { elems: [] });
  socialHeading.classList.add('social-heading-top');

  if (insertAfter && insertAfter.parentElement) {
    insertAfter.parentElement.insertBefore(socialHeading, insertAfter.nextSibling);
  }
  decorateBlock(socialHeading);
  await loadBlock(socialHeading);
}

// build social heading bottom
export async function buildSocialHeadingBottom(insertAfter = null) {
  const socialHeading = buildBlock('social-heading', { elems: [] });
  socialHeading.classList.add('social-heading-bottom');

  if (insertAfter && insertAfter.parentElement) {
    insertAfter.parentElement.insertBefore(socialHeading, insertAfter.nextSibling);
  }
  decorateBlock(socialHeading);
  await loadBlock(socialHeading);
}

/**
 * Estimates the reading time of an article based on the word count
 */
export function estimateReadingTime(wordCount) {
  const readingSpeed = 200;
  const minutes = wordCount / readingSpeed;
  return Math.ceil(minutes);
}

export function estimateTime(wordCount) {
  return getTheTheme() !== 'crn-de' || getTheTheme() !== 'computing-de'
    ? ` • ${estimateReadingTime(wordCount)} min read`
    : ` • Lesezeit ${estimateReadingTime(wordCount)} Min.`;
}

export function formatingDate(articleDate) {
  return getTheTheme() !== 'mescomputing-com' ? formatDateByDMYbyName(articleDate) : formatDateByMDY(articleDate);
}

/**
 * Creates the author card block
 */
export function buildAuthorCard() {
  const article = document.querySelector('article');
  const socialElements = article.querySelectorAll('.social-heading');

  socialElements.forEach((social) => {
    const authorCard = buildBlock('article-author', { elems: [] });
    social.parentElement.insertBefore(authorCard, social);
    decorateBlock(authorCard);
    loadBlock(authorCard);
  });
}

/**
 * Creates the author spotlight block
 */
export function buildAuthorSpotlight() {
  const authorSpotlight = buildBlock('author-spotlight', '');
  const sidebar = document.querySelector('.right-section');
  sidebar.appendChild(authorSpotlight);
  decorateBlock(authorSpotlight);

  return loadBlock(authorSpotlight);
}

/**
 * Fetches list of authors
 */
export async function allAuthors(generator) {
  const result = [];
  for await (const item of generator) {
    result.push(item);
  }
  return result;
}

/**
 * get page param
 */
export function getPageParam() {
  const params = new URLSearchParams(window.location.search);
  return String(params.get('page') || '').trim();
}

/**
 * Builds an ad block with the given ID and type.
 * @param {string} unitId ID of the ad to include in the block.
 *  associated with it.
 * @returns {HTMLElement} Newly built ad block. Will be falsy if the ad type
 *  is unknown.
 */
export function buildAdBlock(unitId) {
  const rightAdHTML = `
    <div class="right-ad">
      <div id="${unitId}" class="tmsads"></div>
    </div>
  `;

  const range = document.createRange();
  return range.createContextualFragment(rightAdHTML);
}

/**
 * next three functions (datamaplookup, getFilterInfoLocatiin, isURL are copied from crn for database display support
 * Determines whether a given value is in a list of comma-separated values.
 * @param {string} dataMap Data map from data-source
 * @param {string} value Value to look for
 * @returns {string} Mapped string if found, value if not
 */
export function dataMapLookup(dataMap, value) {
  const foundValue = dataMap.find((item) => item.key === value);
  return foundValue ? foundValue.value : value;
}

/**
 * Converts filter source code to location of data and mapping
 * @param {string} dataSource report code for data source (eg. ppg, ceo)
 * @returns {Array<string>} Returns data and data map location
 */
export function getFilterInfoLocation(dataSource) {
  const dataSheet = `/data-source/${dataSource}/${dataSource}-data.json`;
  const dataMapSheet = `/data-source/${dataSource}/data-mapping.json`;
  return [dataSheet, dataMapSheet];
}

/**
 * Checks if a string is a URL
 * @param {string} str String to check
 * @returns {boolean} Returns true if URL
 */
export function isURL(str) {
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return urlPattern.test(str);
}

/**
 * Extract from string an Array of string elements.
 * @param {String} stringArray The string to extract from.
 */
export function extractElementsFromString(stringArray) {
  let newStringArray = stringArray;
  if (stringArray.indexOf(',') !== -1) {
    newStringArray = stringArray.split(',').map((item) => item.trim().toLowerCase());
    return newStringArray;
  }
  newStringArray = [newStringArray.toLowerCase()];
  return newStringArray;
}

export function getGermanBtnText() {
  return getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? 'Profil anzeigen' : 'View profile';
}

export function getTheEventsUrl() {
  let url;
  switch (getTheTheme()) {
    case 'mescomputing-com':
      url = 'https://www.thechannelco.com/tcc-events-feed.json';
      break;
    case 'computing-co-uk':
      url = 'https://event.computing.co.uk/events/computing-events-feed/?format=json';
      break;
    case 'channelweb-co-uk':
      url = 'https://event.channelweb.co.uk/events/crn-events/?format=json';
      break;
    case 'crn-de':
      url = 'https://event.crn.de/events/crnde-events/?format=json';
      break;
    case 'computing-de':
      url = 'https://event.computing.co.uk/events/computing-events-feed/?format=json';
      break;
    case 'crn-asia':
      url = 'https://event.crnasia.com/events/crnasia-events/?format=json';
      break;
    case 'crn-australia':
      url = 'https://www.thechannelco.com/tcc-events-feed.json';
      break;
    default:
    // no default
  }
  return url;
}

// Fixes cases where links on page point to incorrect url
// (ex: aem.page instead aem.live)
export function updateHostname(block) {
  block.querySelectorAll('a').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    const site = getTheTheme();
    const siteUrl = site.replace(/-/g, '.');
    let includesSiteUrl = false;

    if (anchor.href.includes(siteUrl)) {
      if (
        anchor.href[anchor.href.indexOf(siteUrl) - 1] === '.' &&
        anchor.href.indexOf('www') === anchor.href.indexOf(siteUrl) - 4
      ) {
        includesSiteUrl = true;
      }
    }

    if (href.includes('aem.page') || href.includes('aem.live') || includesSiteUrl) {
      try {
        const hrefURL = new URL(href);
        hrefURL.hostname = window.location.hostname;
        anchor.setAttribute('href', hrefURL.toString());

        if (anchor.hostname === 'localhost') {
          hrefURL.protocol = 'http:';
          hrefURL.port = getLocalhostPort(getTheTheme());
          anchor.setAttribute('href', hrefURL.toString());
        }
      } catch {
        /* empty */
      }
    }
  });
}
