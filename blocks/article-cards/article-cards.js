/* eslint-disable import/extensions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';
import {
  extractElementsFromString,
  formatingDate,
  estimateTime,
  updateHostname,
  formatToISO8601 // ADDED: import the ISO converter
} from '../../scripts/shared.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';
import { createCategorySlug } from '../../scripts/url-utils.js';
import { fetchPlaceholders } from '../../scripts/aem.js';

/**
 * Creates a title element for the article with a corresponding link
 * @param {object} article The article object
 * @returns {HTMLElement} The title element with a link
 */
function createArticleTitle(article) {
  // MINIMAL CHANGE: Use original date for gating.
  const isLock = shouldBeGated(article.publisheddate);
  const articleTitle = document.createElement('div');
  articleTitle.className = `article-title ${isLock ? 'lock' : ''}`;
  // create an anchor tag for the title
  const articleLink = document.createElement('a');
  articleLink.href = article.path;
  articleLink.setAttribute('aria-label', `Read more about: ${article.title}`);
  // Todo: update after Go Live/CDN switch
  articleLink.textContent = article.title;
  articleTitle.appendChild(articleLink);
  return articleTitle;
}

/**
 * Creates a published date element for the article
 * @param {string} date The UNIX timestamp of the article's published date
 * @param {number} wordcount The word count used for reading time estimation
 * @returns {HTMLElement} The published date element
 */
function createPublishedDate(date, wordcount) {
  // MINIMAL CHANGE: Convert date to ISO for display formatting.
  const publishedDate = document.createElement('div');
  publishedDate.className = 'article-date';
  publishedDate.innerHTML = `
      <img class="article-clock" alt="article-clock-icon" src="/icons/clock.svg"/>
      ${formatingDate(formatToISO8601(date))}${estimateTime(wordcount)}
  `;
  return publishedDate;
}

/**
 * Creates a category element for the article
 * @param {object} article The article object
 * @returns {HTMLElement} The category element with a link
 */
function createArticleCategory(article) {
  const articleCategory = document.createElement('div');
  articleCategory.className = 'article-category';
  const firstCategory = extractElementsFromString(article.category)[0];
  const articleCategoryLink = document.createElement('a');
  articleCategoryLink.href = `/category/${createCategorySlug(firstCategory)}`;
  articleCategoryLink.textContent = firstCategory;
  articleCategoryLink.setAttribute('aria-label', `Read more stories on ${firstCategory}`);
  articleCategory.appendChild(articleCategoryLink);
  return articleCategory;
}

/**
 * Generates an article card with the article's title, author, image,
 * published date, and description
 * @param {object} article The article object
 */
const articlesBlock = document.querySelector('.article-cards-wrapper > div');
function generateCard(article) {
  const articleCard = document.createElement('div');
  articleCard.className = 'article-card';
  const contextWrapper = document.createElement('div');
  contextWrapper.className = 'article-context-wrapper';
  contextWrapper.appendChild(createArticleCategory(article));
  contextWrapper.appendChild(createArticleTitle(article));
  contextWrapper.appendChild(createPublishedDate(article.publisheddate, article.wordcount));
  articleCard.appendChild(contextWrapper);
  articlesBlock.appendChild(articleCard);
  updateHostname(articlesBlock);
}

function appendArticlesToPage(articles) {
  articles.forEach((item, index) => {
    if (index < 10) {
      generateCard(item);
    }
  });
}

/**
 * In allArticlesByPath and allArticlesGenerator, update the publisheddate using formatToISO8601.
 */
async function allArticlesByPath(generator, articlePaths) {
  const result = [];
  for await (const item of generator) {
    if (item.publisheddate) {
      item.publisheddate = formatToISO8601(item.publisheddate);
    }
    // eslint-disable-next-line array-callback-return
    articlePaths.forEach((article) => {
      if (article === item.path) {
        result.push(item);
      }
    });
  }
  return result;
}

async function allArticlesGenerator(generator, topStoriesArticles) {
  const result = [];
  const { ignore } = await fetchPlaceholders();
  const ignoreArray = ignore ? ignore.split(', ') : [];
  
  for await (const item of generator) {
    if (item.publisheddate) {
      item.publisheddate = formatToISO8601(item.publisheddate);
    }
    let isTopStorie = false;
    for (const art of topStoriesArticles) {
      if (art.title === item.title) {
        isTopStorie = true;
        break;
      }
    }
    if (item.publisheddate && !isTopStorie && !ignoreArray.includes(item.type.toLowerCase()) && !ignoreArray.includes(item.category.toLowerCase())) {
      result.push(item);
    }
  }
  return result;
}

async function fetchArticles(url, hasArticlePaths, articlePaths, topStoriesArticles) {
  try {
    let articlesGenerator;
    let articles;
    if (hasArticlePaths) {
      articlesGenerator = ffetch(url);
      articles = await allArticlesByPath(articlesGenerator, articlePaths);
    } else {
      articlesGenerator = ffetch(url).limit(120);
      articles = await allArticlesGenerator(articlesGenerator, topStoriesArticles);
    }
    // Sort articles by publish date (most recent first).
    articles.sort((a, b) => new Date(b.publisheddate) - new Date(a.publisheddate));
    appendArticlesToPage(articles);
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

function getArticlesPaths(li) {
  const arrayCollection = li;
  const paths = [];
  for (const item of arrayCollection) {
    const path = new URL(item.querySelector('a').title);
    paths.push(path.pathname);
  }
  return paths;
}

function getTopStoriesArticles() {
  const topStoriesFirstArticle = document.querySelector('.content-section .top-stories .first-wrap .text-wrap');
  const topStoriesFirstArticleTitle = topStoriesFirstArticle?.querySelector('.top-stories-title a');
  const topStoriesFirstArticleAuthor = topStoriesFirstArticle?.querySelector(
    '.bottom-wrap .top-stories-author a:nth-child(2)'
  );

  const topStoriesSecoundArticles = document.querySelectorAll(
    '.content-section .top-stories .second-wrap .top-stories'
  );

  const topStoriesArticles = [];
  const topStoriesFirstObj = {};

  topStoriesFirstObj.title = topStoriesFirstArticleTitle?.textContent;
  topStoriesFirstObj.author = topStoriesFirstArticleAuthor?.textContent;

  topStoriesArticles.push(topStoriesFirstObj);

  topStoriesSecoundArticles?.forEach((article) => {
    const topStoriesSecoundArticleTitle = article.querySelector(
      '.text-wrap .title-category-wrapper .top-stories-title a'
    );
    const topStoriesSecoundArticleAuthor = article.querySelector('.bottom-wrap .top-stories-author a:nth-child(2)');
    const topStoriesObj = {};

    topStoriesObj.title = topStoriesSecoundArticleTitle?.textContent;
    topStoriesObj.author = topStoriesSecoundArticleAuthor?.textContent;

    topStoriesArticles.push(topStoriesObj);
  });

  return topStoriesArticles;
}

export default function decorate(block) {
  const topStoriesArticles = getTopStoriesArticles();
  const ul = block.querySelector('div div ul');
  let hasArticlePaths = false;
  let articlePaths = [];

  if (ul) {
    const li = ul.getElementsByTagName('li');
    articlePaths = getArticlesPaths(li);
    hasArticlePaths = true;
  }
  // fetch and display articles
  fetchArticles('/article-query-index.json?offset=0', hasArticlePaths, articlePaths, topStoriesArticles);
  block.querySelector('div').remove();
}
