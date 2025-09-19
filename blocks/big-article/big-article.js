/* eslint-disable import/extensions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';
import { estimateTime, extractElementsFromString, formatingDate } from '../../scripts/shared.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';
import { createCategorySlug } from '../../scripts/url-utils.js';

/**
 * Creates an image element for the article with a corresponding link
 * @param {object} article The article object containing the image URL
 * @returns {HTMLElement} The image element with a link
 */
function createArticleImage(article) {
  // Create a div element for the article image
  const articleImage = document.createElement('div');
  articleImage.className = 'big-article-image';
  const imageLink = document.createElement('a');
  imageLink.href = article.path;
  imageLink.target = '_blank';
  const imageElement = document.createElement('img');
  imageElement.src = article.image;
  imageElement.alt = 'Article Image';
  imageLink.appendChild(imageElement);
  articleImage.appendChild(imageLink);
  return articleImage;
}

/**
 * Creates a title element for the article with a corresponding link
 * @param {string} title The title of the article
 * @returns {HTMLElement} The title element with a link
 */
function createArticleTitle(article) {
  const articleTitle = document.createElement('div');
  const isLock = shouldBeGated(article.publisheddate);
  articleTitle.className = `big-article-title ${isLock ? 'lock' : ''}`;
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
  articleAuthor.className = 'big-article-author';
  const articleLink = document.createElement('a');
  let authorImageContainer;
  let authorImage;

  authors.forEach((author) => {
    if (article.author === author.author) {
      // create an anchor tag for the author
      authorImageContainer = document.createElement('a');
      authorImage = document.createElement('img');
      authorImage.alt = author.author;
      articleLink.href = author.path;
      articleLink.textContent = author.author;
      articleLink.setAttribute('aria-label', `Learn about ${author.author}`);
      authorImageContainer.href = author.path;
      authorImage.src = author.authorimage;
    }
    if (article.authoralias !== '0' && article.authoralias !== '') {
      articleLink.textContent = article.authoralias;
      articleLink.setAttribute('aria-label', article.authoralias);
      articleLink.href = article.aliasurl;
    }
  });

  if (
    authorImageContainer &&
    authorImage &&
    authorImage.src !== `${window.location.href}` &&
    (article.authoralias === '' || article.authoralias === '0')
  ) {
    authorImageContainer.appendChild(authorImage);
    articleAuthor.appendChild(authorImageContainer);
  }

  articleAuthor.appendChild(articleLink);
  return articleAuthor;
}

/**
 * Creates a published date element for the article
 * @param {string} date The UNIX timestamp of the article's published date
 * @returns {HTMLElement} The published date element
 */
function createPublishedDate(date, wordcount) {
  const publishedDate = document.createElement('div');
  publishedDate.className = 'big-article-date';
  publishedDate.innerHTML = `
      <img class="article-clock" src="/icons/clock.svg"/>
  ${formatingDate(date)}${estimateTime(wordcount)}
  `;
  return publishedDate;
}

/**
 * Creates a category element for the article
 * @param {string} category The category of the article
 * @returns {HTMLElement} The title element with a link
 */
function createArticleCategory(article) {
  const articleCategory = document.createElement('div');
  articleCategory.className = 'big-article-category';
  const firstCategory = extractElementsFromString(article.category)[0];
  const articleCategoryLink = document.createElement('a');
  articleCategoryLink.href = `/category/${createCategorySlug(firstCategory)}`;
  articleCategoryLink.textContent = firstCategory;
  articleCategory.appendChild(articleCategoryLink);
  return articleCategory;
}

/**
 * Generates an article card containing the article's title, author, image, published date, and description.
 * @param {Object} article The article object containing all necessary data.
 * @param {number} index The index of the article in the list.
 * @param {string} divClassName The class name of the div where the card will be appended.
 */
function generateCard(article, index, divClassName, authors) {
  const articleCard = document.createElement('div');
  articleCard.className = 'big-article';

  // Create a div for the image
  const imageDiv = document.createElement('div');
  imageDiv.className = 'big-article-image';
  if (article.image !== '0' && article.image !== '') {
    imageDiv.appendChild(createArticleImage(article));
  }

  // Create a div for the title, category, description, author, and published date
  const contentDiv = document.createElement('div');
  contentDiv.className = 'text-wrap';

  const topDiv = document.createElement('div');
  topDiv.className = 'title-category-wrapper';

  // Append title, category, description, author, and published date to the content div
  topDiv.appendChild(createArticleTitle(article));
  topDiv.appendChild(createArticleCategory(article));
  contentDiv.appendChild(topDiv);

  const bottomDiv = document.createElement('div');
  bottomDiv.className = 'bottom-wrap';

  bottomDiv.appendChild(createArticleAuthor(article, authors));
  bottomDiv.appendChild(createPublishedDate(article.publisheddate, article.wordcount));

  contentDiv.appendChild(bottomDiv);

  // Append the image div and content div to the article card
  if (article.image !== '0' && article.image !== '') {
    articleCard.appendChild(imageDiv);
  }
  articleCard.appendChild(contentDiv);

  // Append the card to the appropriate div
  let targetDiv;
  if (index === 0) {
    targetDiv = document.querySelector('.first-wrap');
  }

  if (targetDiv) {
    targetDiv.appendChild(articleCard);
  } else {
    console.error(`Div with class ${divClassName} not found`);
  }
}

/**
 * Fetches articles from a specified URL and generates a card for each article
 * If the specified sheet is not found, it fetches articles without specifying a sheet
 * @param {string} url The URL to fetch articles from
 */
// helper function to collect all articles from the generator
async function all(generator) {
  const result = [];
  for await (const item of generator) {
    result.push(item);
  }
  return result;
}

function generateCardsByURLs(articles, authors) {
  articles.forEach((article, index) => {
    const divClassName = index === 0 ? '.first-wrap' : '';
    generateCard(article, index, divClassName, authors);
  });
}

/**
 * Checks if a block has the 'sponsored-resources' class.
 * @param {HTMLElement} block The block to check.
 * @returns {boolean}
 */
function checkSponsoredResource(block) {
  return block.classList.contains('preselected-resources');
}

async function fetchArticleData(url) {
  try {
    const articlesGenerator = ffetch(url);
    const articles = await all(articlesGenerator);
    return articles;
  } catch (error) {
    console.error('Error fetching article data:', error);
    return [];
  }
}

function findArticleByPath(articlesData, path) {
  if (!Array.isArray(articlesData)) {
    console.error(articlesData);
    return null;
  }
  return articlesData.find((article) => article.path === path) || null;
}

/**
 * Converts manual input paths to article objects using data from a given array of articles.
 * @param {Array<string>} paths An array of article paths.
 * @param {Array<Object>} articlesData An array of article data objects.
 * @returns {Array<Object>} An array of article objects.
 */
function convertPathsToObjects(paths, articlesData) {
  if (!Array.isArray(articlesData)) {
    console.error(articlesData);
    return [];
  }
  return paths.map((path) => {
    const articleDetails = findArticleByPath(articlesData, path);
    return {
      path,
      image: articleDetails ? articleDetails.image : '',
      title: articleDetails ? articleDetails.title : 'Default Title',
      author: articleDetails ? articleDetails.author : 'Anonymous',
      publisheddate: articleDetails ? articleDetails.publisheddate : '0',
      category: articleDetails ? articleDetails.category : 'General',
      wordcount: articleDetails ? articleDetails.wordcount : '0',
      authoralias: articleDetails ? articleDetails.authoralias : '0',
      authorurl: articleDetails ? articleDetails.authorurl : '0',
    };
  });
}

/**
 * Retrieves paths from HTML list items within a specified block, converts them to article objects using provided article data, and stores these objects in a global array.
 * This function is specifically used for processing manually specified paths within a block that are expected to correspond to Sponsored Resources class.
 * The paths are extracted from the text content of list items, converted to URLs, and then to article objects using the convertPathsToObjects function.
 *
 * @param {HTMLElement} block The block containing the list of paths.
 * @param {Array<Object>} articlesData An array of article data objects from which to extract article details.
 * @returns {Array<Object>} An array of article objects created from the paths found in the block.
 */

function getSponsoredResourcesPaths(block, articlesData) {
  const arrayCollection = block.querySelector('div div ul').getElementsByTagName('li');
  const paths = [];
  for (const item of arrayCollection) {
    const path = new URL(item.innerText);
    paths.push(path.pathname);
  }
  const articleObjects = convertPathsToObjects(paths, articlesData);
  return articleObjects;
}

/**
 * Fetches and processes articles from the query-index, then generates a card for each article.
 * @param {string} url The URL to fetch articles from.
 * @returns {Promise<Array>} A promise that resolves to an array of articles.
 */
async function fetchArticles(url, limit) {
  try {
    const articlesGenerator = ffetch(url).limit(limit);
    const articles = await all(articlesGenerator);
    return articles;
  } catch (error) {
    console.error('Error fetching articles', error);
    return [];
  }
}

async function fetchAuthors(url) {
  try {
    const authorsGenerator = ffetch(url);
    return await all(authorsGenerator);
  } catch (error) {
    console.error('Error fetching articles', error);
    return [];
  }
}

export default async function decorate(block) {
  const articlesData = await fetchArticleData('/article-query-index.json');
  const authors = await fetchAuthors('/author-query-index.json');

  const firstRow = document.createElement('div');
  firstRow.className = 'first-wrap';
  block.appendChild(firstRow);

  let articlesToRender = [];

  if (checkSponsoredResource(block)) {
    const numArticles = getSponsoredResourcesPaths(block, articlesData);
    articlesToRender = numArticles;
    if (numArticles.length < 1) {
      const additionalArticles = await fetchArticles('/article-query-index.json?offset=0', 1 - numArticles);
      articlesToRender = [...articlesToRender, ...additionalArticles];
    }
  } else {
    articlesToRender = await fetchArticles('/article-query-index.json?offset=0', 1);
  }

  generateCardsByURLs(articlesToRender, authors);

  block.querySelector('div').remove();
}
