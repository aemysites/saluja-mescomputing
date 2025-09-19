/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';
import {
  estimateTime,
  extractElementsFromString,
  formatingDate,
  getTheTheme,
  sortArticlesByPublishDate,
  formatToISO8601,  // <-- ADDED FOR DATE NORMALIZATION
} from '../../scripts/shared.js';
import { createCategorySlug, getOriginalNameFromSlug } from '../../scripts/url-utils.js';
import { getMetadata } from '../../scripts/aem.js';
import { createPagination, getArticlesByPage, pagination } from '../../scripts/pagination.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';

const range = document.createRange();
function render(html) {
  return range.createContextualFragment(html);
}

/**
 * Generates an article card with the article's number, title and publish date
 * @param {Object} article The article object
 */
function generateCard(article) {
  const isLock = shouldBeGated(article.publisheddate);
  const firstCategory = extractElementsFromString(article.category)[0];
  let articleDesc = article.description;
  if (articleDesc === '0') {
    articleDesc = '';
  }

  return render(`
    <div class="listing-card">
    ${
      article.image !== '0' && article.image !== ''
        ? `<div class="listing-card-image-wrapper">
          <a href="${article.path}">
            <img class='listing-card-image' src="${article.image}"/>
          </a>
        </div>`
        : ''
    }
        <div class="listing-card-context">
        ${
          firstCategory !== '0'
            ? `<h4 class="listing-card-category">
            <a href="/category/${createCategorySlug(firstCategory)}">
              ${firstCategory}
            </a>
          </h4>`
            : ``
        }
          <div class="listing-card-title ${isLock ? 'lock' : ''}">
            <h4><a title="${article.title}" class="" href="${article.path}">${article.title}</a></h4>
          </div>
          <div class="listing-card-description">
            <p>${articleDesc}</p>
          </div>
          <div class="listing-card-date">
            <img alt="clock" src="/icons/clock.svg">
              ${formatingDate(article.publisheddate)}${estimateTime(article.wordcount)}
          </div>
        </div>
    </div>
  `);
}

/**
 * Append article block to the main block
 */
function appendArticlesToPage(articles, block, isFromPagination) {
  const article = generateCard(articles);
  if (isFromPagination) {
    const paginationBlock = block.querySelector('.listing-page-pagination');
    block.insertBefore(article, paginationBlock);
  } else {
    block.appendChild(article);
  }
}

async function allType(generator) {
  const result = [];
  for await (const item of generator) {
    if (item.publisheddate) {
      // NORMALIZE DATE:
      item.publisheddate = formatToISO8601(item.publisheddate);
      result.push(item);
    }
  }
  return result;
}

/**
 * Fetches articles from a specified URL and generates a card for each article.
 * If the specified sheet is not found, it fetches articles without specifying a sheet.
 */
async function all(generator, filteredBySpecificWord, filteredBy) {
  const result = [];
  for await (const item of generator) {
    const categoryChange = extractElementsFromString(item.category)[0];

    if ((getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de') && filteredBySpecificWord === 'fusionen-und-uebernahmen') {
      // eslint-disable-next-line no-param-reassign
      filteredBySpecificWord = 'm-a';
    }

    const category = createCategorySlug(categoryChange);
    const type = item.type.replaceAll(' ', '-').toLowerCase();

    const isContentHUb =
      filteredBy === 'tag' &&
      filteredBySpecificWord === 'infrastructure-as-a-service-hub' &&
      item.tag.toLowerCase().includes('infrastructure-as-a-service hub');

    const isTag =
      filteredBy === 'tag' &&
      filteredBySpecificWord === 'artificial-intelligence' &&
      (getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de') &&
      item.tag.toLowerCase().includes('ai');
    const listOfTags = item.tag.toLowerCase().split(',');
    let t;
    let sameTag = false;

    // eslint-disable-next-line no-loop-func
    listOfTags.forEach((tag) => {
      if (tag.startsWith(' ')) {
        t = tag.replace(' ', '');
      } else {
        t = tag;
      }

      // Use our createCategorySlug function for consistent tag matching
      const tagSlug = createCategorySlug(t);
      if (tagSlug === filteredBySpecificWord) {
        sameTag = true;
      }
    });

    const author = item.author
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

    // For category pages, only include articles that have the specific category
    if (filteredBy === 'category') {
      if (
        item.category !== '0' &&
        item.publisheddate &&
        category === filteredBySpecificWord
      ) {
        // NORMALIZE DATE:
        item.publisheddate = formatToISO8601(item.publisheddate);
        result.push(item);
      }
    } else if (
      (item.category !== '0' || (item.category === '0' && author === filteredBySpecificWord.replaceAll('-', ' '))) &&
      item.publisheddate &&
      (category === filteredBySpecificWord ||
        type === filteredBySpecificWord ||
        sameTag ||
        isContentHUb ||
        isTag ||
        author === filteredBySpecificWord.replaceAll('-', ' '))
    ) {
      // NORMALIZE DATE:
      item.publisheddate = formatToISO8601(item.publisheddate);
      result.push(item);
    }
  }
  return result;
}

async function allTypeLimit(generator, filteredBySpecificWord) {
  const result = [];
  for await (const item of generator) {
    const type = item.Type.replaceAll(' ', '-').toLowerCase();
    if (item && type === filteredBySpecificWord) {
      // NORMALIZE DATE:
      item.publisheddate = formatToISO8601(item.publisheddate);
      result.push(item);
    }
  }
  return result;
}

function createPaginationAndArticles(articles, pageNumber, block) {
  const articlesByPage = getArticlesByPage(articles, pageNumber, 10);
  articlesByPage.forEach((article) => appendArticlesToPage(article, block, false));
  const totalNumberOfPages = Math.ceil(articles.length / 10);
  if (totalNumberOfPages > 1) {
    block.append(createPagination(totalNumberOfPages));
  }
  pagination(pageNumber, block, articles, 10);
}

async function fetchArticles(url, filteredBy, filteredBySpecificWord, block, pageNumber) {
  try {
    const articlesGenerator = ffetch(url);
    const articles = await all(articlesGenerator, filteredBySpecificWord, filteredBy);
    if (articles.length === 0 && filteredBy === 'author') {
      block.querySelector('.listing-page-title').style.display = 'none';
    }

    createPaginationAndArticles(articles, pageNumber, block);
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

async function fetchType(url, filteredBySpecificWord, block, filteredBy, pageNumber) {
  try {
    const response = await fetch(url);
    const json = await response.json();

    const articles = await allType(json.data, filteredBySpecificWord, filteredBy);

    sortArticlesByPublishDate(articles);

    createPaginationAndArticles(articles, pageNumber, block);
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

async function fetchTypeLimit(url, filteredBySpecificWord, block, filteredBy, pageNumber) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    const articles = await allTypeLimit(json.data, filteredBySpecificWord);
    const offset = Number(articles[0].Offset);
    const limit = articles[0].Limit;

    fetchType(
      `/article-query-index.json?sheet=typesort&offset=${offset}&limit=${limit}`,
      filteredBySpecificWord,
      block,
      filteredBy,
      pageNumber
    );
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

function fetchArticlesByFiltered(filteredBy, filteredBySpecificWord, block, pageNumber) {
  if (filteredBy === 'category') {
    // Use direct approach for category pages
    fetchArticles('/article-query-index.json', filteredBy, filteredBySpecificWord, block, pageNumber);
  } else if (filteredBy === 'type') {
    fetchTypeLimit(
      '/article-query-index.json?sheet=type&offset=0&limit=10000',
      filteredBySpecificWord,
      block,
      filteredBy,
      pageNumber
    );
  } else {
    // use drafts for testing until we have good date in main json
    fetchArticles('/article-query-index.json', filteredBy, filteredBySpecificWord, block, pageNumber);
  }
}

function getTheArticles(filteredBy, filteredBySpecificWord, block, pageNumber) {
  const specificWord = filteredBySpecificWord.toLowerCase().replaceAll(' ', '-');
  fetchArticlesByFiltered(filteredBy, specificWord, block, pageNumber);
}

function getPageParam() {
  const params = new URLSearchParams(window.location.search);
  return String(params.get('page') || '').trim();
}

export default async function decorate(block) {
  const url = window.location.href;
  let filteredBy = getMetadata('template');
  const urlArray = url.split(`/`);
  let filteredBySpecificWord;

  filteredBySpecificWord = String(urlArray[urlArray.length - 1].split('?')[0]);

  const title = document.createElement('h1');
  title.className = 'listing-page-title';

  const isProfilePage = document.querySelector('.listing-page-wrapper');

  if (filteredBy === 'author') {
    title.innerText = getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Artikel von` : `Articles by ${filteredBySpecificWord}`;
    title.style.textTransform = 'unset';

    if (isProfilePage) {
      title.innerText =
      getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Artikel von ${getMetadata('author')}` : `Articles by ${getMetadata('author')}`;
    }
  } else if (url.includes('/category/') || url.includes('/tag/')) {
    // For category and tag pages, try to get the original German text
    // For now, use a simple approach - capitalize and replace dashes with spaces
    // This will be improved with the async function
    const displayName = filteredBySpecificWord
      .replace(/-/g, ' ')
      .replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
    title.innerText = displayName;
      
      // Try to get the real original name asynchronously and update if found
      getOriginalNameFromSlug(filteredBySpecificWord, url.includes('/category/') ? 'category' : 'tag')
        .then(originalName => {
          if (originalName && originalName !== displayName) {
            title.innerText = originalName;
          }
        })
        .catch(() => {
          // Silently handle error - fallback to simple display name
        });
    } else {
      title.innerText = getMetadata('og:title') === 'Tech Marketing Hub' ? '' : getMetadata('og:title');
    }

  let pageNumber = getPageParam();

  if (pageNumber === '') {
    pageNumber = '1';
  }

  // listing page for content hub pages
  // const contenthubTag = createCategorySlug(getMetadata('tag'));
  let contenthubTag = '';
  try {
    const tagPathRegex = /tag\/[A-Za-z0-9](-?[A-Za-z0-9])*/g;
    const tagRegex = /[A-Za-z0-9](-?[A-Za-z0-9])*/g;
    const tagPathName = window.location.pathname.match(tagPathRegex)[0];
    // eslint-disable-next-line prefer-destructuring
    contenthubTag = tagPathName.match(tagRegex)[1];
    if (contenthubTag) {
      // For tag pages, try to get the original German text
      // For now, use a simple approach - capitalize and replace dashes with spaces
      // This will be improved with the async function
      const displayName = contenthubTag
        .replace(/-/g, ' ')
        .replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
      title.innerText = displayName;
      
      // Try to get the real original name asynchronously and update if found
      getOriginalNameFromSlug(contenthubTag, 'tag')
        .then(originalName => {
          if (originalName && originalName !== displayName) {
            title.innerText = originalName;
          }
        })
        .catch(() => {
          // Silently handle error - fallback to simple display name
        });
    }
  } catch (e) {
    /* empty */
  }

  let contenthubCategory = '';
  try {
    const categoryPathRegex = /\/category\/.+?(?:\/?$|[^/]+$)/g;
    const categoryPathName = window.location.pathname.match(categoryPathRegex)[0];
    const categoryPathNameComponents = categoryPathName.split('/');
    contenthubCategory = categoryPathNameComponents[categoryPathNameComponents.length - 1];
    if (contenthubCategory) {
      title.innerText = contenthubCategory
        .replaceAll('-', ' ')
        .replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
    }
  } catch (e) {
    /* empty */
  }

  const type = getMetadata('type');
  if (url.includes('content-hub') || type === 'content-hub') {
    if (contenthubTag) {
      filteredBy = 'tag';
      filteredBySpecificWord = contenthubTag;
    } else if (contenthubCategory) {
      filteredBy = 'category';
      filteredBySpecificWord = contenthubCategory;
    }
  }
  
  getTheArticles(filteredBy, filteredBySpecificWord, block, pageNumber);

  block.append(title);

  if ((url.includes('content-hub') && !url.includes('type')) || type === 'content-hub') {
    block.querySelector('.listing-page > h1').style.display = 'none';
  }
}
