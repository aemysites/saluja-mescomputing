import { estimateTime, formatingDate } from '../../scripts/shared.js';
import ffetch from '../../scripts/ffetch.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';

/**
 * Creates an image element for the article with a corresponding link
 * @param {object} article The article object containing the image URL
 * @returns {HTMLElement} The image element with a link
 */
function createArticleImageElement(article) {
  // Create a div element for the article image
  const articleImage = document.createElement('div');
  articleImage.className = 'featured-content-article-image';

  // Create an anchor element for the article link
  const imageLink = document.createElement('a');
  // Set the href attribute of the link to the article path
  imageLink.href = article.path;

  // Create the image element
  const imageElement = document.createElement('img');
  // Set the src attribute of the image to the image URL from the article object
  imageElement.src = article.image;
  // Set the alt attribute of the image for accessibility
  imageElement.alt = 'Article Image';

  // Append the image element to the anchor element
  imageLink.appendChild(imageElement);

  // Append the anchor element to the article image div
  articleImage.appendChild(imageLink);

  // Return the article image div element
  return articleImage;
}

/**
 * Creates a title element for the article with a corresponding link
 * @param {string} title The title of the article
 * @returns {HTMLElement} The title element with a link
 */
function createArticleTitleElement(article) {
  const articleTitle = document.createElement('div');
  const isLock = shouldBeGated(article.publisheddate);
  articleTitle.className = `featured-content-article-title ${isLock ? 'lock' : ''}`;
  // create an anchor tag for the title
  const articleLink = document.createElement('a');
  articleLink.href = article.path;
  // Todo: update after Go Live/CDN switch
  articleLink.textContent = article.title;
  articleTitle.appendChild(articleLink);
  return articleTitle;
}

/**
 * Creates a author element for the article with a corresponding link
 * @param {string} author The author of the article
 * @returns {HTMLElement} The author element with a link
 */
function createArticleAuthor(article, authors) {
  const articleAuthor = document.createElement('div');
  articleAuthor.className = 'featured-content-author';
  const articleLink = document.createElement('a');
  let authorImageContainer;
  let authorImage;

  authors.forEach((author) => {
    if (article.author === author.author) {
      // create an anchor tag for the author
      authorImageContainer = document.createElement('a');
      authorImage = document.createElement('img');
      articleLink.href = author.path;
      articleLink.textContent = author.author;
      authorImageContainer.href = author.path;
      authorImage.src = author.authorimage;
    }
    if (article.authoralias !== '0' && article.authoralias !== '') {
      articleLink.textContent = article.authoralias;
      articleLink.setAttribute('aria-label', article.authoralias);
      articleLink.href = article.aliasurl;
    }
  });

  if (authorImageContainer) {
    if (article.authoralias === '0' || article.authoralias === '') authorImageContainer.appendChild(authorImage);
    articleAuthor.appendChild(authorImageContainer);
  }
  articleAuthor.appendChild(articleLink);
  return articleAuthor;
}

function createPublishedDate(date, wordcount) {
  const publishedDate = document.createElement('div');
  publishedDate.className = 'featured-content-date';
  publishedDate.innerHTML = `
   ${formatingDate(date)}${estimateTime(wordcount)}
  `;
  return publishedDate;
}

/**
 * Fetches articles from a specified URL and generates a card for each article
 * If the specified sheet is not found, it fetches articles without specifying a sheet
 * @param {string} url The URL to fetch articles from
 */
// helper function to collect all articles from the generator
async function collectArticles(generator) {
  const result = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const item of generator) {
    result.push(item);
  }
  return result;
}

async function fetchAuthors(url) {
  try {
    const authorsGenerator = ffetch(url);
    return await collectArticles(authorsGenerator);
  } catch (error) {
    console.error('Error fetching authors', error);
    return [];
  }
}

/**
 * Fetches and processes articles from the query-index, then generates a card for each article.
 * @param {string} url The URL to fetch articles from.
 * @returns {Promise<Array>} A promise that resolves to an array of articles.
 */
async function fetchArticles(url, limit) {
  try {
    let articlesGenerator;
    if (limit) {
      articlesGenerator = ffetch(url).limit(limit);
    } else {
      articlesGenerator = ffetch(url);
    }
    const articles = await collectArticles(articlesGenerator);
    return articles;
  } catch (error) {
    console.error('Error fetching articles', error);
    return [];
  }
}

/**
 * Generates an article card with the article's title, author, image,
 * published date, and description
 * @param {Object} article The article object
 */
const articlesList = document.createElement('div');
articlesList.className = 'featured-content-article-list';
document.querySelector('.featured-content-wrapper > div').appendChild(articlesList);
const articlesBlock = document.querySelector('.featured-content-wrapper > div > .featured-content-article-list');

function generateCard(article, authors) {
  const articleCard = document.createElement('div');
  articleCard.className = 'featured-content-article';
  const contextWrapper = document.createElement('div');
  contextWrapper.className = 'featured-content-article-context-wrapper';

  const leftWrap = document.createElement('div');
  leftWrap.className = 'featured-content-left-wrap';
  leftWrap.appendChild(createArticleImageElement(article));

  const rightWrap = document.createElement('div');
  rightWrap.className = 'featured-content-right-wrap';
  rightWrap.appendChild(createArticleTitleElement(article));

  const rightWrapChildContainer = document.createElement('div');
  rightWrapChildContainer.className = 'featured-content-right-wrap-child';
  rightWrapChildContainer.appendChild(createArticleAuthor(article, authors));
  rightWrapChildContainer.appendChild(createPublishedDate(article.publisheddate, article.wordcount));
  rightWrap.appendChild(rightWrapChildContainer);

  contextWrapper.appendChild(leftWrap);
  contextWrapper.appendChild(rightWrap);

  articleCard.appendChild(contextWrapper);
  articlesBlock.appendChild(articleCard);
}

function addBlockTitle(block) {
  const blockTitle = document.createElement('div');
  blockTitle.className = 'featured-content-title';
  blockTitle.innerHTML = 'Featured content';
  block.prepend(blockTitle);
}

function checkManualArticle(block) {
  return block.classList.contains('contains-article');
}

function getManualArticlePath(block) {
  return block.querySelector('div:nth-of-type(2) div a').getAttribute('title');
}

function getArticleByPath(block, articles) {
  const manualArticlePath = getManualArticlePath(block);
  let selectedArticle;
  const url = new URL(manualArticlePath);
  const manualAriclePathName = url.pathname;
  articles.forEach((item) => {
    if (item.path === manualAriclePathName) {
      selectedArticle = item;
    }
  });
  return selectedArticle;
}

export default async function decorate(block) {
  addBlockTitle(block);
  const authors = await fetchAuthors('/author-query-index.json');
  let articlesToRender = [];
  if (checkManualArticle(block)) {
    articlesToRender = await fetchArticles('/article-query-index.json?offset=0', 0);
    generateCard(getArticleByPath(block, articlesToRender), authors);
  } else {
    articlesToRender = await fetchArticles('/article-query-index.json?offset=0', 1);
    generateCard(articlesToRender[0], authors);
  }
}
